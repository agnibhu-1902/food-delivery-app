import express from 'express'
import { addPromoCode, fetchPromoCode, listPromoCodes, removePromoCode } from '../controllers/promoCodeController.js'

const promoCodeRouter = express.Router()

promoCodeRouter.post('/add', addPromoCode)
promoCodeRouter.post('/fetch', fetchPromoCode)
promoCodeRouter.get('/list', listPromoCodes)
promoCodeRouter.post('/remove', removePromoCode)

export default promoCodeRouter