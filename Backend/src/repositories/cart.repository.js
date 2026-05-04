const Cart = require('../models/cart.model');

const cartRepository = {

  async findActiveByUserId(userId) {
    return await Cart.findOne({ where: { userId, status: 'active' } });
  },

  async findAllByUserId(userId) {
    return await Cart.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  },

  async findById(id) {
    return await Cart.findByPk(id);
  },

  async save(data) {
    return await Cart.create(data);
  },

  async update(id, data) {
    await Cart.update(data, { where: { id } });
    return await Cart.findByPk(id);
  },

};

module.exports = cartRepository;
