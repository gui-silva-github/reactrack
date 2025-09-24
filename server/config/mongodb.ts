import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Conectado ao banco de dados!!!")
    })
    await mongoose.connect(`${process.env.MONGODB_URL}/reactrack`)
}

export default connectDB