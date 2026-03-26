import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import userModel from "../../models/user"
import transporter from "../../templates/nodemailer"
import { Request, Response } from "express"

export const registerController = async (req: Request, res: Response) => {

    const { name, email, password } = req.body

    if (!name || !email || !password){
        res.melt(400, {success: false, message: "Está faltando detalhes!"})
        return
    }

    try{
        const existingUser = await userModel.findOne({email})

        if (existingUser){
            res.melt(400, {success: false, message: "Usuário já existe!"})
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({
            name, email, password: hashedPassword
        })

        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Bem Vindo ao ReactRack',
            text: `Bem Vindo ao ReactRack, sua conta foi criada com o email: ${email}`
        }

        await transporter.sendMail(mailOptions)

        res.melt(201, {
            success: true,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
            },
        })
        return
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
    }

}