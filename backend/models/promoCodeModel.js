import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    codeId: {type: String, required: true, unique: true},
    discount: {type: Number, required: true}
})

const promoCodeModel = mongoose.models.promoCode || mongoose.model('promoCode', promoCodeSchema)

export default promoCodeModel