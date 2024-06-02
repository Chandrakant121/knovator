const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
require('dotenv').config()

const generateToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRETE_KEY);
}

const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).send("User already exist")
        }

        user = await User.create(req.body)
        const token = generateToken(user)
        return res.status(200).send({ user, token })
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
}

const login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })

        // Check Email
        if (!user) {
            return res.status(400).send("Incorrect Email or Password")
        }

        // Check Password
        const match = user.checkPassword(req.body.password)
        if (!match) {
            return res.status(400).send("Incorrect Email or Password")
        }

        // if matches
        const token = generateToken(user)
        return res.status(200).send({ user, token })
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
}

module.exports = { register, login, generateToken }