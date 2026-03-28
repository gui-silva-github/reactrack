import 'dotenv/config'
import connectDB from "./config/mongodb"
import { startGraphQL } from "./graphql/server"
import app from "./app"
import errorRouter from "./routes/error"

const port = process.env.PORT || 4000

connectDB()

startGraphQL(app).then(() => {
    app.use(errorRouter)
    app.listen(port, () => {
        console.log(`Servidor rodando no endereço http://localhost:${port}`)
    })
})