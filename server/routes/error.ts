import express, { Request, Response, NextFunction } from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const errorRouter = express.Router()

errorRouter.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).sendFile(path.join(__dirname, '../', 'views', 'error', 'index.html'))
})

export default errorRouter