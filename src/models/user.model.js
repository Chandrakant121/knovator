const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
})

userSchema.pre("save", function (next) {
    const salt = 10;
    const hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
    return next()
})


userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


const User = new mongoose.model('user', userSchema)
module.exports = User