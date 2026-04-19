const jwt = require('jsonwebtoken')


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({success: false, message: "Token no proporcionado"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch(error) {
        return res.status(403).json({ success: false, message: "Token invalido o expirado"})
    }
}

module.exports = authMiddleware