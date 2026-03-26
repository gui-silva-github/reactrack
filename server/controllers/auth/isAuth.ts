import { Request, Response } from "express"

export const isAuthController = async (req: Request, res: Response) => {
    
    try{
        res.melt(200, {success: true})
        return
    } catch (error: any){
        res.melt(500, {success: false, message: error.message})
    }
}