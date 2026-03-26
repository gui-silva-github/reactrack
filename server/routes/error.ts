import express, { Request, Response, NextFunction } from "express"
import path from "path"
import { getPath } from "../utils/paths"

const errorRouter = express.Router()

errorRouter.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).sendFile(path.join(getPath('views'), 'error', 'index.html'))
})

export default errorRouter