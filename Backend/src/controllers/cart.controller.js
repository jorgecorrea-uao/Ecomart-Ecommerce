const cartService = require('../services/cart.service');

const KNOWN_ERRORS = ['No hay un carrito activo'];

const cartController = {

  async getCart(req, res) {
    try {
      const cart = await cartService.getOrCreate(req.user.id);
      return res.status(200).json({ success: true, data: cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async checkout(req, res) {
    try {
      const cart = await cartService.checkout(req.user.id);
      return res.status(200).json({ success: true, message: 'Compra realizada exitosamente', data: cart });
    } catch (error) {
      if (KNOWN_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async getHistory(req, res) {
    try {
      const carts = await cartService.getHistory(req.user.id);
      return res.status(200).json({ success: true, data: carts });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

};

module.exports = cartController;
