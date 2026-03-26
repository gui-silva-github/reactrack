import userModel from "../../models/user"
import { Request, Response } from "express"

export const validateResetOtpController = async (req: Request, res: Response) => {
    const { email, otp } = req.body

    if (!email?.trim() || !otp?.trim()) {
        res.melt(400, {
            success: false,
            message: "E-mail e OTP são obrigatórios.",
        })
        return
    }

    try {
        const user = await userModel.findOne({ email: email.trim() })

        if (!user) {
            res.melt(404, {
                success: false,
                message: "Usuário não encontrado.",
            })
            return
        }

        if (user.resetOtp === "" || user.resetOtp !== String(otp).trim()) {
            res.melt(401, {
                success: false,
                message: "OTP inválida.",
            })
            return
        }

        if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
            res.melt(401, {
                success: false,
                message: "OTP expirada.",
            })
            return
        }

        res.melt(200, {
            success: true,
            message: "OTP válida. Informe a nova senha.",
        })
        return
    } catch (error: any) {
        res.melt(500, { success: false, message: error.message })
        return
    }
}
