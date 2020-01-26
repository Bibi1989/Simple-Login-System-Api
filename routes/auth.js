const jwt = require('jsonwebtoken')

const authToken = (req, res, next) => {
    const token = res.header('auth-token')
    if(!token) return res.status(404).json("Access Denied")

    try {
        const confirm = jwt.verify(token, process.env.SECRET)
        req.reg = confirm
    } catch (error) {
        res.status(404).json("Not valid token")
    }
}

module.exports = authToken