const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authMiddleware, adminMiddleware, productController.create);
router.put('/:id', authMiddleware, adminMiddleware, productController.update);
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);
router.patch('/:id/stock', authMiddleware, adminMiddleware, productController.updateStock);

module.exports = router;
