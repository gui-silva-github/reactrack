import userModel from "../../models/user"
import transporter from "../../templates/nodemailer"
import { PASSWORD_RESET_TEMPLATE } from "../../templates/email"
import { Request, Response } from "express"

export const resetOtpController = async (req: Request, res: Response) => {

    const { email } = req.body 

    if (!email){
        res.melt(400, {success: false, message: 'Email é requerido!'})
        return
    }

    try{

        const user = await userModel.findOne({email})

        if (!user){
            res.melt(404, {success: false, message: 'Usuário não encontrado!'})
            return
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp 
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Refinição de Senha (OTP)',
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption)

        res.melt(200, {success: true, message: 'OTP enviada no seu email...'})
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
        return
    }

}