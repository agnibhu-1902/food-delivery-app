import promoCodeModel from "../models/promoCodeModel.js";

const addPromoCode = async (req, res) => {
    const newCode = new promoCodeModel({
        codeId: req.body.codeId,
        discount: req.body.discount
    })
    try {
        await newCode.save()
        res.json({success: true, message: 'Promo code added successfully'})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to add promo code'})
    }
}

const removePromoCode = async (req, res) => {
    try {
        const data = await promoCodeModel.findOneAndDelete({codeId: req.body.codeId})
        if (!data)
            throw 'Invalid promo code'
        res.json({success: true, message: 'Promo code deleted successfully'})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Cannot delete promo code'})
    }
}

const fetchPromoCode = async (req, res) => {
    try {
        const codeData = await promoCodeModel.findOne({codeId: req.body.codeId})
        if (!codeData)
            throw 'Invalid promo code'
        res.json({success: true, data: codeData})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: error})
    }
}

const listPromoCodes = async (req, res) => {
    try {
        const codes = await promoCodeModel.find({})
        res.json({success: true, data: codes})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to list promo codes'})
    }
}

export {addPromoCode, removePromoCode, fetchPromoCode, listPromoCodes}