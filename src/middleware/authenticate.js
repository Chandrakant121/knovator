require('dotenv').config()
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        let decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY,
            (err, decoded) => {
                if (err) {
                    return reject(err)
                }
                return resolve(decoded)
            })
    })

}

const authenticate = async (req, res, next) => {

    if (!req.headers.authorization.startsWith("Bearer ")) {
        res.status(400).send("Authorization token not found or incorrect")
    }

    if (!req.headers.authorization.startsWith("Bearer ")) {
        res.status(400).send("Authorization token not found or incorrect")
    }

    let decoded;
    const token = req.headers.authorization.trim().split(" ")[1]
    // console.log(token)
    try {
        // token includes user info
        decoded = await verifyToken(token)
    }
    catch (err) {
        res.status(400).send("Authorization token not found or incorrect")
    }
    // console.log("Here", decoded)
    req.user = decoded.user 
    next()
}

module.exports = authenticate