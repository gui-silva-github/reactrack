import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import errorRouter from "./routes/error"
import homeRouter from "./routes/home"
import { getPath } from "./utils/paths"
import { meltMiddleware } from "./middlewares/melt"

const app = express()

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:4200",
])

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev"
app.use(morgan(morganFormat))
app.use(meltMiddleware)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.has(origin)) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use("/public", express.static(getPath("public")))
app.set("views", getPath("views"))

app.use("/", homeRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use(errorRouter)

export default app
