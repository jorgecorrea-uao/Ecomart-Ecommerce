const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const sequelize = require('../config/db');
const Product = require('../models/product.model');

const cartService = {

  async getOrCreate(userId) {
    const existing = await cartRepository.findActiveByUserId(userId);
    if (existing) return existing;
    return await cartRepository.save({ userId, status: 'active' });
  },

  async checkout(userId) {
    const cart = await cartRepository.findActiveByUserId(userId);
    if (!cart) throw new Error('No hay un carrito activo');

    // Perform checkout within a DB transaction: re-check stock and decrement
    const t = await sequelize.transaction();
    try {
      // Reload cart items for transaction safety
      await cart.reload({ include: [{ model: require('../models/cartItem.model') }], transaction: t });

      for (const item of cart.CartItems) {
        const product = await Product.findByPk(item.productId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
        if (product.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${product.nombre}`);
        }
        // Decrement stock
        const newStock = product.stock - item.cantidad;
        await product.update({ stock: newStock }, { transaction: t });
      }

      // Mark cart as paid
      await cart.update({ status: 'paid' }, { transaction: t });

      await t.commit();
      return cart;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async getHistory(userId) {
    return await cartRepository.findAllByUserId(userId);
  },

};

module.exports = cartService;
