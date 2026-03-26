import mongoose from "mongoose";

const connectDB = async () => {
    const mongodbUrl = process.env.MONGODB_URL
    if (!mongodbUrl) {
        throw new Error("MONGODB_URL is not defined")
    }

    const dbName = process.env.MONGODB_DB_NAME?.trim()

    mongoose.connection.on('error', (error) => {
        console.error("Erro de conexão com o banco:", error.message)
    })

    mongoose.connection.on('disconnected', () => {
        console.warn("Conexão com o banco foi encerrada.")
    })

    mongoose.connection.on('connected', () => {
        console.log("Conectado ao banco de dados!!!")
    })

    await mongoose.connect(mongodbUrl, {
        dbName: dbName || undefined
    })
}

export default connectDB