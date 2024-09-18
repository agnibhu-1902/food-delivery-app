import foodModel from "../models/foodModel.js";
import fs from 'fs'

// add food item
const addFood = async (req, res) => {
    const image_filename = `${req.file.filename}`

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save()
        res.json({success: true, message: 'Food added successfully'})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Cannot add food'})
    }
}

// all foods list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({success: true, data: foods})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Failed to list foods'})
    }
}

// remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`, () => {})
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: 'Food removed successfully'})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Cannot remove food'})
    }
}

export {addFood, listFood, removeFood}