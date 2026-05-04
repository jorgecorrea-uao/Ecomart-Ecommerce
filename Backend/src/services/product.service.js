const productRepository = require('../repositories/product.repository');

const productService = {

  async getAll({ categoria, page, limit }) {
    return await productRepository.findAll({ categoria, page, limit });
  },

  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },

  async create({ nombre, descripcion, precio, stock, categoria }) {
    if (!nombre || precio === undefined) throw new Error('Nombre y precio son obligatorios');
    if (Number(precio) <= 0) throw new Error('El precio debe ser mayor a 0');
    if (stock !== undefined && Number(stock) < 0) throw new Error('El stock no puede ser negativo');

    return await productRepository.save({ nombre, descripcion, precio, stock, categoria });
  },

  async update(id, { nombre, descripcion, precio, stock, categoria }) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Producto no encontrado');

    if (precio !== undefined && Number(precio) <= 0) throw new Error('El precio debe ser mayor a 0');
    if (stock !== undefined && Number(stock) < 0) throw new Error('El stock no puede ser negativo');

    return await productRepository.update(id, { nombre, descripcion, precio, stock, categoria });
  },

  async delete(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Producto no encontrado');
    await productRepository.delete(id);
  },

  async updateStock(id, stock) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Producto no encontrado');
    if (Number(stock) < 0) throw new Error('El stock no puede ser negativo');

    return await productRepository.update(id, { stock });
  },

};

module.exports = productService;
