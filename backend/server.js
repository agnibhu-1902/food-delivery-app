import 'dotenv/config'
import express from "express"
import cors from "cors"
import { connectDb } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from './routes/orderRoute.js'
import promoCodeRouter from './routes/promoCodeRoute.js'

// app config
const app = express()
const port = 4000
const frontend_url = "http://localhost"

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// DB connection
connectDb()

// API endpoints
app.use('/api/food', foodRouter)
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/promocode', promoCodeRouter)
app.use('/images', express.static('uploads'))

app.get('/health', (req, res) => {
    res.status(200).json({message: 'App is healthy'})
})

app.post("/verify", (req, res) => {
    const orderId = req.query.orderId
    let success = true
    if (typeof req.body.razorpay_payment_id == 'undefined' || req.body.razorpay_payment_id < 1)
        success = false
    return res.redirect(`${frontend_url}/verify?success=${success}&orderId=${orderId}`)
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))