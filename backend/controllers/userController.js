import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

const createToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        
        if (!user)
            return res.json({success: false, message: 'No user with the given email exists'})

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched)
            return res.json({success: false, message: 'Incorrect password'})

        const token = createToken(user._id)
        return res.json({success: true, token})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'An unknown error occurred'})
    }
}

// register user
const registerUser = async (req, res) => {
    const {name, password, email} = req.body
    try {
        // checking if user already exists
        const exists = await userModel.findOne({email})
        if (exists)
            return res.json({success: false, message: 'User with the given email already exists'})

        // validating email format and strong password
        if (!validator.isEmail(email))
            return res.json({success: false, message: 'Please enter a valid email'})
        if (password.length < 8)
            return res.json({success: false, message: 'Please enter a strong password'})

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create a document
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({success: true, token})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'An unknown error occurred'})
    }
}

export {loginUser, registerUser}