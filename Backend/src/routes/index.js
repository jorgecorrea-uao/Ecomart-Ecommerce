const express = require('express')
const router = express.Router()
const authRoutes = require('./auth.routes')
const cartRoutes = require('./cart.routes')

router.use('/auth', authRoutes)
router.use('/cart', cartRoutes)

module.exports = router
