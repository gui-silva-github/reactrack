import userModel from "../../models/user"
import transporter from "../../templates/nodemailer"
import { EMAIL_VERIFY_TEMPLATE } from "../../templates/email"
import { Request, Response } from "express"

export const sendVerifyOtpController = async (req: Request, res: Response) => {

    try{

        const { userId } = res.locals

        const user = await userModel.findById(userId);

        if (!user) {
            res.melt(400, {success: false, message: 'Usuário não encontrado!'});
            return
        }

        if (user.isAccountVerified){
            res.melt(200, {success: false, message: 'Conta já verificada!'})
            return
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verificação OTP da Conta',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption)

        res.melt(200, {success: true, message: 'Verificação OTP enviada no Email'})

    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
    }

}