import userModel from "../../models/user"
import { Request, Response } from "express"

export const verifyEmailController = async (req: Request, res: Response) => {

    const { userId } = res.locals
    const { otp } = req.body

    if (!userId || !otp){
        res.melt(400, {success: false, message: 'Faltam detalhes...'})
        return
    }

    try{

        const user = await userModel.findById(userId)
        
        if (!user){
            res.melt(400, {success: false, message: 'Usuário não encontrado!'})
            return
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp){
            res.melt(401, {success: false, message: 'OTP inválida!'})
            return
        }

        if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now()){
            res.melt(401, {success: false, message: 'OTP expirada!'})
            return
        }

        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save()

        res.melt(200, {success: true, message: 'Email verificado com sucesso!'})
        return
    
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
        return
    }

}