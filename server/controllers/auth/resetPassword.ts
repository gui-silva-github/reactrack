import bcrypt from "bcryptjs"
import userModel from "../../models/user"
import { Request, Response } from "express"

export const resetPasswordController = async (req: Request, res: Response) => {

    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword){
        res.melt(400, {success: false, message: 'Email, OTP e Nova Senha são requeridos!'})
        return
    }

    try{

        const user = await userModel.findOne({email})

        if (!user){
            res.melt(400, {success: false, message: 'Usuário não encontrado!'})
            return
        }

        if (user.resetOtp === '' || user.resetOtp !== otp){
            res.melt(401, {success: false, message: 'OTP inválida!'})
            return
        }

        if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()){
            res.melt(401, {success: false, message: 'OTP expirada!'})
            return
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0

        await user.save()

        res.melt(200, {success: true, message: 'Senha redefinida com sucesso!!!'})
        return
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
        return
    }

}