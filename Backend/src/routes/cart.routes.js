const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware)

router.get('/', cartController.getCart)
router.post('/items', cartController.addItem)
router.put('/items/:itemId', cartController.updateItem)
router.delete('/items/:itemId', cartController.removeItem)

module.exports = router
