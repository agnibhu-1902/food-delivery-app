import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        if (!cartData[req.body.itemId])
            cartData[req.body.itemId] = 1
        else
            cartData[req.body.itemId] += 1
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success: true, message: 'Added to cart'})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: 'Failed to add to cart'})
    }
}

const  removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        if (cartData[req.body.itemId] > 0)
            cartData[req.body.itemId] -= 1
        else
            throw 'Tried to remove an item that was not present or was assigned a quantity of 0'
        if (cartData[req.body.itemId] === 0)
            delete cartData[req.body.itemId]
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success: true, message: 'Removed from cart'})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to remove from cart'})
    }
}

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        res.json({success: true, cartData})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to list cart items'})
    }
}

export {addToCart, removeFromCart, getCart}