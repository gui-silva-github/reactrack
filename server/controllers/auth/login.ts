import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import userModel from "../../models/user"
import { Request, Response } from "express"

export const loginController = async (req: Request, res: Response) => {
    
    const { email, password } = req.body

    if (!email || !password){
        res.melt(400, {success: false, message: "Email e senha são necessários!"})
        return
    }

    try{
        
        const user = await userModel.findOne({email})

        if (!user){
            res.melt(400, {success: false, message: 'Usuário e/ou senha estão incorretos!'})
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            res.melt(400, {success: false, message: 'Usuário e/ou senha estão incorretos!'})
            return
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.melt(200, {success: true, id: user.id})
        return
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
        return
    }

}