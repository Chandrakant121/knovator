const express = require('express')
const connect = require('./configs/db')
const passport = require('./configs/google-oauth')
const { register, login, generateToken } = require('./controllers/auth.controller')
const postController = require('./controllers/post.controller')

const app = express()
app.use(express.json())

app.post('/register', register)
app.post('/login', login)

app.use('/post', postController);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        const token = generateToken(req.user)
        return res.status(200).send({ user: req.user, token })
    }
);

const PORT = 5050

app.listen(PORT, async () => {
    try {
        await connect()
        console.log(`Connected to ${PORT}`)
    }
    catch (err) {
        console.log(err)
    }
})