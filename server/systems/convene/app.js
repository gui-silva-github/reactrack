import bodyParser from "body-parser";
import express from "express"

import eventRoutes from "./routes/event.js"

const app = express()

app.use(bodyParser.json())
app.use(express.static('public/convene'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    )
    next()
})

app.use('/events', eventRoutes)

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || 'Algo deu errado!'
    res.status(status).json({ message: message })
})

app.listen(3003, () => {
    console.log(`Backend do Convene pronto para gerenciar seus eventos...`)
})