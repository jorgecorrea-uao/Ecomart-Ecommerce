const cartItemService = require('../services/cartItem.service');
const cartItemRepository = require('../repositories/cartItem.repository');
const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');

jest.mock('../repositories/cartItem.repository');
jest.mock('../repositories/cart.repository');
jest.mock('../repositories/product.repository');

const mockCart = { id: 1, userId: 1, status: 'active' };
const mockProduct = { id: 10, nombre: 'Camiseta', precio: 29.99, stock: 5 };
const mockItem = { id: 100, cartId: 1, productId: 10, nombre: 'Camiseta', precio: 29.99, cantidad: 1 };

beforeEach(() => jest.clearAllMocks());

describe('CartItemService - addItem', () => {
  test('debe agregar un item nuevo al carrito', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    productRepository.findById.mockResolvedValue(mockProduct);
    cartItemRepository.findByCartAndProduct.mockResolvedValue(null);
    cartItemRepository.save.mockResolvedValue(mockItem);

    const result = await cartItemService.addItem(1, 10, 1);

    expect(cartItemRepository.save).toHaveBeenCalledWith({
      cartId: 1, productId: 10, nombre: 'Camiseta', precio: 29.99, cantidad: 1,
    });
    expect(result.nombre).toBe('Camiseta');
  });

  test('debe incrementar cantidad si el producto ya está en el carrito', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    productRepository.findById.mockResolvedValue(mockProduct);
    cartItemRepository.findByCartAndProduct.mockResolvedValue({ ...mockItem, cantidad: 2 });
    cartItemRepository.update.mockResolvedValue({ ...mockItem, cantidad: 3 });

    const result = await cartItemService.addItem(1, 10, 1);

    expect(cartItemRepository.update).toHaveBeenCalledWith(100, { cantidad: 3 });
    expect(cartItemRepository.save).not.toHaveBeenCalled();
  });

  test('debe lanzar error si no hay stock suficiente', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    productRepository.findById.mockResolvedValue({ ...mockProduct, stock: 1 });
    cartItemRepository.findByCartAndProduct.mockResolvedValue(null);

    await expect(cartItemService.addItem(1, 10, 5)).rejects.toThrow('Stock insuficiente');
  });

  test('debe lanzar error si no hay carrito activo', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(null);

    await expect(cartItemService.addItem(1, 10, 1)).rejects.toThrow('No hay un carrito activo');
  });

  test('debe lanzar error si el producto no existe', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    productRepository.findById.mockResolvedValue(null);

    await expect(cartItemService.addItem(1, 99, 1)).rejects.toThrow('Producto no encontrado');
  });
});

describe('CartItemService - updateQuantity', () => {
  test('debe actualizar la cantidad correctamente', async () => {
    cartItemRepository.findById.mockResolvedValue(mockItem);
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    productRepository.findById.mockResolvedValue(mockProduct);
    cartItemRepository.update.mockResolvedValue({ ...mockItem, cantidad: 3 });

    const result = await cartItemService.updateQuantity(1, 100, 3);

    expect(cartItemRepository.update).toHaveBeenCalledWith(100, { cantidad: 3 });
    expect(result.cantidad).toBe(3);
  });

  test('debe lanzar error si la cantidad es menor a 1', async () => {
    await expect(cartItemService.updateQuantity(1, 100, 0)).rejects.toThrow('La cantidad mínima es 1');
  });

  test('debe lanzar error si el item no pertenece al cart del usuario', async () => {
    cartItemRepository.findById.mockResolvedValue({ ...mockItem, cartId: 99 });
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);

    await expect(cartItemService.updateQuantity(1, 100, 2)).rejects.toThrow('No autorizado');
  });

  test('debe lanzar error si no hay stock suficiente', async () => {
    cartItemRepository.findById.mockResolvedValue(mockItem);
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    productRepository.findById.mockResolvedValue({ ...mockProduct, stock: 1 });

    await expect(cartItemService.updateQuantity(1, 100, 5)).rejects.toThrow('Stock insuficiente');
  });
});

describe('CartItemService - removeItem', () => {
  test('debe eliminar el item correctamente', async () => {
    cartItemRepository.findById.mockResolvedValue(mockItem);
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);
    cartItemRepository.delete.mockResolvedValue();

    await expect(cartItemService.removeItem(1, 100)).resolves.not.toThrow();
    expect(cartItemRepository.delete).toHaveBeenCalledWith(100);
  });

  test('debe lanzar error si el item no existe', async () => {
    cartItemRepository.findById.mockResolvedValue(null);

    await expect(cartItemService.removeItem(1, 999)).rejects.toThrow('Item no encontrado');
  });

  test('debe lanzar error si el item no pertenece al cart del usuario', async () => {
    cartItemRepository.findById.mockResolvedValue({ ...mockItem, cartId: 99 });
    cartRepository.findActiveByUserId.mockResolvedValue(mockCart);

    await expect(cartItemService.removeItem(1, 100)).rejects.toThrow('No autorizado');
  });
});
