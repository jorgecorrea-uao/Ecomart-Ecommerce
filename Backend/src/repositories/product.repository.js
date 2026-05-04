const { Op } = require('sequelize');
const Product = require('../models/product.model');

const productRepository = {

  async findAll({ categoria, page = 1, limit = 10 }) {
    const where = {};
    if (categoria) where.categoria = { [Op.like]: `%${categoria}%` };

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    return { total: count, page: Number(page), limit: Number(limit), data: rows };
  },

  async findById(id) {
    return await Product.findByPk(id);
  },

  async save(data) {
    return await Product.create(data);
  },

  async update(id, data) {
    await Product.update(data, { where: { id } });
    return await Product.findByPk(id);
  },

  async delete(id) {
    await Product.destroy({ where: { id } });
  },

};

module.exports = productRepository;
