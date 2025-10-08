import userModel from "../../models/user"
import transporter from "../../templates/nodemailer"
import { EMAIL_VERIFY_TEMPLATE } from "../../templates/email"
import { Request, Response } from "express"

export const sendVerifyOtpController = async (req: Request, res: Response) => {

    try{

        const { userId } = res.locals

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({success: false, message: 'Usuário não encontrado!'});
        }

        if (user.isAccountVerified){
            return res.status(200).json({success: false, message: 'Conta já verificada!'})
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

        res.status(200).json({success: true, message: 'Verificação OTP enviada no Email'})

    } catch (error: any){
        res.status(500).json({success: false, message: error.message})
    }

}