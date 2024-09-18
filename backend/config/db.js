import mongoose from 'mongoose'

export const connectDb = async () => {
    await mongoose.connect('mongodb+srv://agnibhumandal:bIl8aLYaLXoBx9EU@cluster0.zt2an.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Database connected!'))
}