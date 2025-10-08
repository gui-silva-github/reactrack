import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import userModel from "../../models/user"
import { Request, Response } from "express"

export const loginController = async (req: Request, res: Response) => {
    
    const { email, password } = req.body

    if (!email || !password){
        return res.status(400).json({success: false, message: "Email e senha são necessários!"})
    }

    try{
        
        const user = await userModel.findOne({email})

        if (!user){
            return res.status(400).json({success: false, message: 'Usuário e/ou senha estão incorretos!'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            return res.status(400).json({success: false, message: 'Usuário e/ou senha estão incorretos!'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({success: true, id: user.id})
    } catch (error: any){
        return res.status(500).json({success: false, message: error.message})
    }

}