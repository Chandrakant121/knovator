const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
require("dotenv").config()
const User = require('../models/user.model')
const { v4: uuidv4 } = require('uuid')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        let user = await User.findOne({ email: profile?._json?.email }).lean().exec()
        if (!user) {
            user = await User.create({
                email: profile?._json?.email,
                password: uuidv4(),
            })
        }
        console.log(user)
        return cb(null, user);
    }
));

module.exports = passport
