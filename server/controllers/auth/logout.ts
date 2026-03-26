import { Request, Response } from "express"

export const logoutController = async (req: Request, res: Response) => {

    try{

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.melt(200, {success: true, message: 'Deslogado!!!'})
        return

    } catch (error: any){
        res.melt(200, {success: false, message: error.message})
        return
    }

}