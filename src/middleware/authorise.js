// role =["seller","admin"]

const authorise = (role) => {
    return async (req, res, next) => {
        let flag = false
        try {
            role.map((role) => {
                if (req.user.role.includes(role)) {
                    flag = true
                }
            })
            if (flag) {
                return next()
            }
            else {
                return res.status(401).send("Not authorised person")
            }

        }
        catch (err) {
            return res.status(400).send(err.message)
        }
    }
}

module.exports = authorise