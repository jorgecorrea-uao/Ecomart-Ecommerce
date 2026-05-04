const productService = require('../services/product.service');

const NOT_FOUND_ERRORS = ['Producto no encontrado'];
const VALIDATION_ERRORS = [
  'Nombre y precio son obligatorios',
  'El precio debe ser mayor a 0',
  'El stock no puede ser negativo',
];

const productController = {

  async getAll(req, res) {
    try {
      const { categoria, page, limit } = req.query;
      const result = await productService.getAll({ categoria, page, limit });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async getById(req, res) {
    try {
      const product = await productService.getById(req.params.id);
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async create(req, res) {
    try {
      const { nombre, descripcion, precio, stock, categoria } = req.body;
      const product = await productService.create({ nombre, descripcion, precio, stock, categoria });
      return res.status(201).json({ success: true, message: 'Producto creado exitosamente', data: product });
    } catch (error) {
      if (VALIDATION_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async update(req, res) {
    try {
      const { nombre, descripcion, precio, stock, categoria } = req.body;
      const product = await productService.update(req.params.id, { nombre, descripcion, precio, stock, categoria });
      return res.status(200).json({ success: true, message: 'Producto actualizado exitosamente', data: product });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (VALIDATION_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async delete(req, res) {
    try {
      await productService.delete(req.params.id);
      return res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async updateStock(req, res) {
    try {
      const { stock } = req.body;

      if (stock === undefined) {
        return res.status(400).json({ success: false, message: 'El campo stock es obligatorio' });
      }

      const product = await productService.updateStock(req.params.id, stock);
      return res.status(200).json({ success: true, message: 'Stock actualizado exitosamente', data: product });
    } catch (error) {
      if (NOT_FOUND_ERRORS.includes(error.message)) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (VALIDATION_ERRORS.includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

};

module.exports = productController;
