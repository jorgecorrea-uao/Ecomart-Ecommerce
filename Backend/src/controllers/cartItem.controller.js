const cartItemService = require('../services/cartItem.service');

const NOT_FOUND_ERRORS = ['Producto no encontrado', 'Item no encontrado'];
const VALIDATION_ERRORS = ['Stock insuficiente', 'La cantidad mínima es 1'];
const AUTH_ERRORS = ['No autorizado'];
const CART_ERRORS = ['No hay un carrito activo'];

const cartItemController = {

  async addItem(req, res) {
    try {
      const { productId, cantidad } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'El productId es obligatorio' });
      }

      const item = await cartItemService.addItem(req.user.id, productId, cantidad);
      return res.status(201).json({ success: true, message: 'Producto agregado al carrito', data: item });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if ([...VALIDATION_ERRORS, ...CART_ERRORS].includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async updateQuantity(req, res) {
    try {
      const { cantidad } = req.body;

      if (cantidad === undefined) {
        return res.status(400).json({ success: false, message: 'La cantidad es obligatoria' });
      }

      const item = await cartItemService.updateQuantity(req.user.id, req.params.id, cantidad);
      return res.status(200).json({ success: true, message: 'Cantidad actualizada', data: item });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (AUTH_ERRORS.includes(error.message)) {
        return res.status(403).json({ success: false, message: error.message });
      }
      if (VALIDATION_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async removeItem(req, res) {
    try {
      await cartItemService.removeItem(req.user.id, req.params.id);
      return res.status(200).json({ success: true, message: 'Item eliminado del carrito' });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (AUTH_ERRORS.includes(error.message)) {
        return res.status(403).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

};

module.exports = cartItemController;
