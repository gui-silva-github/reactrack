import userModel from "../../models/user"
import { Request, Response } from "express"

export const validateResetOtpController = async (req: Request, res: Response) => {
    const { email, otp } = req.body

    if (!email?.trim() || !otp?.trim()) {
        return res.status(400).json({
            success: false,
            message: "E-mail e OTP são obrigatórios.",
        })
    }

    try {
        const user = await userModel.findOne({ email: email.trim() })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado.",
            })
        }

        if (user.resetOtp === "" || user.resetOtp !== String(otp).trim()) {
            return res.status(401).json({
                success: false,
                message: "OTP inválida.",
            })
        }

        if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "OTP expirada.",
            })
        }

        return res.status(200).json({
            success: true,
            message: "OTP válida. Informe a nova senha.",
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
