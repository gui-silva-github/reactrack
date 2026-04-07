import { Request, Response } from "express"
import userModel from "../../models/user"

export const getDataController = async (req: Request, res: Response) => {

    try {
        const { userId } = res.locals as any

        const user = await userModel.findById(userId)

        if (!user){
            res.melt(400, {success: false, message: 'Usuário não encontrado!'})
            return
        }

        res.melt(200, {
            success: true,
            userData: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            },
        })
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
    }

}