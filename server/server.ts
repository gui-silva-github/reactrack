import 'dotenv/config'
import connectDB from "./config/mongodb"
import app from "./app"

const port = process.env.PORT || 4000

connectDB()

app.listen(port, () => {
    console.log(`Servidor rodando no endereço http://localhost:${port}`)
})