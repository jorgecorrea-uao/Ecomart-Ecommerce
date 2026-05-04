const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const cartItemController = require('../controllers/cartItem.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, cartController.getCart);
router.post('/checkout', authMiddleware, cartController.checkout);
router.get('/history', authMiddleware, cartController.getHistory);

router.post('/items', authMiddleware, cartItemController.addItem);
router.put('/items/:id', authMiddleware, cartItemController.updateQuantity);
router.delete('/items/:id', authMiddleware, cartItemController.removeItem);

module.exports = router;
