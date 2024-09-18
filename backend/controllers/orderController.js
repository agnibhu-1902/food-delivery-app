import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import Razorpay from 'razorpay'
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env

const instance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
})

// placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}})
        
        const amount = req.body.amount * 100
        const options = {
            amount,
            currency: 'INR',
            receipt: 'receipt'
        }
        instance.orders.create(options, (error, order) => {
            if (!error)
                res.json({
                    success: true,
                    message: 'Order created',
                    amount,
                    key_id: RAZORPAY_ID_KEY,
                    order_id: order.id,
                    data: req.body.address,
                    db_order_id: newOrder._id
                })
            else
                res.json({success: false, message: 'Something went wrong!'})
        })
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Something went wrong!'})
    }
}

const verifyOrder = async (req, res) => {
    const {success, orderId} = req.body
    try {
        if (success == 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            res.json({success: true, message: 'Amount paid'})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success: false, message: 'Amount not paid'})
        }
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'An unknown error occurred'})
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({success: true, data: orders})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to display orders list'})
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, data: orders})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to display orders list'})
    }
}

// API for updating status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
        res.json({success: true, message: 'Status updated'})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to update status'})
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}