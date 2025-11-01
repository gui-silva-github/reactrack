import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from "./config/mongodb"
import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import errorRouter from "./routes/error"
import homeRouter from "./routes/home"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const port = process.env.PORT || 4000

connectDB()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', homeRouter)

app.use('/auth', authRouter)

app.use('/user', userRouter)

app.use(errorRouter)

app.listen(port, () => {
    console.log(`Servidor rodando no endereço http://localhost:${port}`)
})