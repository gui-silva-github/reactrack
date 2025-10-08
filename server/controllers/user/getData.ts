import { Request, Response } from "express"
import userModel from "../../models/user"

export const getDataController = async (req: Request, res: Response) => {

    try {
        const { userId } = res.locals as any

        const user = await userModel.findById(userId)

        if (!user){
            return res.status(400).json({success: false, message: 'Usuário não encontrado!'})
        }

        res.status(200).json({
            success: true, 
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })
    } catch (error: any){
        res.status(500).json({success: false, message: error.message})
    }

}