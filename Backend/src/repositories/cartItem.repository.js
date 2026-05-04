const CartItem = require('../models/cartItem.model');

const cartItemRepository = {

  async findByCartId(cartId) {
    return await CartItem.findAll({ where: { cartId } });
  },

  async findById(id) {
    return await CartItem.findByPk(id);
  },

  async findByCartAndProduct(cartId, productId) {
    return await CartItem.findOne({ where: { cartId, productId } });
  },

  async save(data) {
    return await CartItem.create(data);
  },

  async update(id, data) {
    await CartItem.update(data, { where: { id } });
    return await CartItem.findByPk(id);
  },

  async delete(id) {
    await CartItem.destroy({ where: { id } });
  },

};

module.exports = cartItemRepository;
