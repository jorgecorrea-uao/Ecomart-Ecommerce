const cartItemRepository = require('../repositories/cartItem.repository');
const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');

const cartItemService = {

  async addItem(userId, productId, cantidad = 1) {
    const cart = await cartRepository.findActiveByUserId(userId);
    if (!cart) throw new Error('No hay un carrito activo');

    const product = await productRepository.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const existing = await cartItemRepository.findByCartAndProduct(cart.id, productId);

    const cantidadFinal = existing ? existing.cantidad + Number(cantidad) : Number(cantidad);
    if (product.stock < cantidadFinal) throw new Error('Stock insuficiente');

    if (existing) {
      return await cartItemRepository.update(existing.id, { cantidad: cantidadFinal });
    }

    return await cartItemRepository.save({
      cartId: cart.id,
      productId,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: cantidadFinal,
    });
  },

  async updateQuantity(userId, itemId, cantidad) {
    if (Number(cantidad) < 1) throw new Error('La cantidad mínima es 1');

    const item = await cartItemRepository.findById(itemId);
    if (!item) throw new Error('Item no encontrado');

    const cart = await cartRepository.findActiveByUserId(userId);
    if (!cart || cart.id !== item.cartId) throw new Error('No autorizado');

    const product = await productRepository.findById(item.productId);
    if (product.stock < Number(cantidad)) throw new Error('Stock insuficiente');

    return await cartItemRepository.update(itemId, { cantidad: Number(cantidad) });
  },

  async removeItem(userId, itemId) {
    const item = await cartItemRepository.findById(itemId);
    if (!item) throw new Error('Item no encontrado');

    const cart = await cartRepository.findActiveByUserId(userId);
    if (!cart || cart.id !== item.cartId) throw new Error('No autorizado');

    await cartItemRepository.delete(itemId);
  },

};

module.exports = cartItemService;
