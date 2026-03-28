import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../../../models/user"
import transporter from "../../../templates/nodemailer"
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../../../templates/email"
import type { GraphQLContext } from "../../context"
import { clearAuthCookie, getAuthCookieOptions, TOKEN_COOKIE } from "../../auth/cookieSettings"

export const authMutations = {
  async login(
    _parent: unknown,
    args: { email: string; password: string },
    context: GraphQLContext
  ) {
    const { email, password } = args
    const { res } = context

    if (!email?.trim() || !password) {
      return { success: false, message: "Email e senha são necessários!", userId: null }
    }

    try {
      const user = await userModel.findOne({ email: email.trim() })

      if (!user) {
        return { success: false, message: "Usuário e/ou senha estão incorretos!", userId: null }
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return { success: false, message: "Usuário e/ou senha estão incorretos!", userId: null }
      }

      const secret = process.env.JWT_SECRET
      if (!secret) {
        return { success: false, message: "JWT_SECRET não configurado", userId: null }
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" })

      res.cookie(TOKEN_COOKIE, token, getAuthCookieOptions())

      return { success: true, message: null, userId: user.id }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg, userId: null }
    }
  },

  async register(
    _parent: unknown,
    args: { input: { name: string; email: string; password: string } },
    context: GraphQLContext
  ) {
    const { name, email, password } = args.input
    const { res } = context

    if (!name?.trim() || !email?.trim() || !password) {
      return {
        success: false,
        message: "Está faltando detalhes!",
        user: null,
      }
    }

    try {
      const existingUser = await userModel.findOne({ email: email.trim() })

      if (existingUser) {
        return { success: false, message: "Usuário já existe!", user: null }
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = new userModel({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
      })

      await user.save()

      const secret = process.env.JWT_SECRET
      if (!secret) {
        return { success: false, message: "JWT_SECRET não configurado", user: null }
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" })

      res.cookie(TOKEN_COOKIE, token, getAuthCookieOptions())

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email.trim(),
        subject: "Bem Vindo ao ReactRack",
        text: `Bem Vindo ao ReactRack, sua conta foi criada com o email: ${email.trim()}`,
      }

      await transporter.sendMail(mailOptions)

      return {
        success: true,
        message: null,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified ?? false,
        },
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg, user: null }
    }
  },

  async logout(_parent: unknown, _args: unknown, context: GraphQLContext) {
    const { res } = context
    try {
      clearAuthCookie(res)
      return { success: true, message: "Deslogado!!!" }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro"
      return { success: false, message: msg }
    }
  },

  async sendVerifyOtp(_parent: unknown, _args: unknown, context: GraphQLContext) {
    try {
      const userId = context.user?.id
      if (!userId) {
        return { success: false, message: "Não autorizado! Logue novamente" }
      }

      const user = await userModel.findById(userId)

      if (!user) {
        return { success: false, message: "Usuário não encontrado!" }
      }

      if (user.isAccountVerified) {
        return { success: false, message: "Conta já verificada!" }
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000))

      user.verifyOtp = otp
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

      await user.save()

      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Verificação OTP da Conta",
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
      }

      await transporter.sendMail(mailOption)

      return { success: true, message: "Verificação OTP enviada no Email" }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg }
    }
  },

  async verifyAccount(_parent: unknown, args: { otp: string }, context: GraphQLContext) {
    const userId = context.user?.id
    const { otp } = args

    if (!userId || !otp) {
      return { success: false, message: "Faltam detalhes..." }
    }

    try {
      const user = await userModel.findById(userId)

      if (!user) {
        return { success: false, message: "Usuário não encontrado!" }
      }

      if (user.verifyOtp === "" || user.verifyOtp !== otp) {
        return { success: false, message: "OTP inválida!" }
      }

      if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now()) {
        return { success: false, message: "OTP expirada!" }
      }

      user.isAccountVerified = true
      user.verifyOtp = ""
      user.verifyOtpExpireAt = 0

      await user.save()

      return { success: true, message: "Email verificado com sucesso!" }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg }
    }
  },

  async sendResetOtp(_parent: unknown, args: { email: string }) {
    const { email } = args

    if (!email) {
      return { success: false, message: "Email é requerido!" }
    }

    try {
      const user = await userModel.findOne({ email })

      if (!user) {
        return { success: false, message: "Usuário não encontrado!" }
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000))

      user.resetOtp = otp
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

      await user.save()

      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Refinição de Senha (OTP)",
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
      }

      await transporter.sendMail(mailOption)

      return { success: true, message: "OTP enviada no seu email..." }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg }
    }
  },

  async validateResetOtp(_parent: unknown, args: { email: string; otp: string }) {
    const { email, otp } = args

    if (!email?.trim() || !otp?.trim()) {
      return { success: false, message: "E-mail e OTP são obrigatórios." }
    }

    try {
      const user = await userModel.findOne({ email: email.trim() })

      if (!user) {
        return { success: false, message: "Usuário não encontrado." }
      }

      if (user.resetOtp === "" || user.resetOtp !== String(otp).trim()) {
        return { success: false, message: "OTP inválida." }
      }

      if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
        return { success: false, message: "OTP expirada." }
      }

      return { success: true, message: "OTP válida. Informe a nova senha." }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg }
    }
  },

  async resetPassword(_parent: unknown, args: { email: string; otp: string; newPassword: string }) {
    const { email, otp, newPassword } = args

    if (!email || !otp || !newPassword) {
      return { success: false, message: "Email, OTP e Nova Senha são requeridos!" }
    }

    try {
      const user = await userModel.findOne({ email })

      if (!user) {
        return { success: false, message: "Usuário não encontrado!" }
      }

      if (user.resetOtp === "" || user.resetOtp !== otp) {
        return { success: false, message: "OTP inválida!" }
      }

      if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
        return { success: false, message: "OTP expirada!" }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      user.password = hashedPassword
      user.resetOtp = ""
      user.resetOtpExpireAt = 0

      await user.save()

      return { success: true, message: "Senha redefinida com sucesso!!!" }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg }
    }
  },
}
