const cartRepository = require('../repositories/cart.repository');

const cartService = {

  async getOrCreate(userId) {
    const existing = await cartRepository.findActiveByUserId(userId);
    if (existing) return existing;
    return await cartRepository.save({ userId, status: 'active' });
  },

  async checkout(userId) {
    const cart = await cartRepository.findActiveByUserId(userId);
    if (!cart) throw new Error('No hay un carrito activo');
    return await cartRepository.update(cart.id, { status: 'paid' });
  },

  async getHistory(userId) {
    return await cartRepository.findAllByUserId(userId);
  },

};

module.exports = cartService;
