jest.mock('../repositories/cart.repository', () => ({
  findActiveByUserId: jest.fn(),
  findAllByUserId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../config/db', () => ({
  transaction: jest.fn(),
}));
jest.mock('../models/cartItem.model', () => ({}));
jest.mock('../models/product.model', () => ({
  findByPk: jest.fn(),
}));

const cartRepository = require('../repositories/cart.repository');
const sequelize = require('../config/db');
const Product = require('../models/product.model');
const cartService = require('../services/cart.service');

const mockActiveCart = {
  id: 1,
  userId: 1,
  status: 'active',
  CartItems: [],
  reload: jest.fn(),
  update: jest.fn(),
};

const mockPaidCart = { id: 1, userId: 1, status: 'paid' };

const createTransaction = () => ({
  commit: jest.fn(),
  rollback: jest.fn(),
  LOCK: { UPDATE: 'UPDATE' },
});

beforeEach(() => jest.clearAllMocks());

describe('CartService - getOrCreate', () => {
  test('debe retornar el cart activo si ya existe', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(mockActiveCart);

    const result = await cartService.getOrCreate(1);

    expect(result.status).toBe('active');
    expect(cartRepository.save).not.toHaveBeenCalled();
  });

  test('debe crear un cart nuevo si no hay uno activo', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(null);
    cartRepository.save.mockResolvedValue(mockActiveCart);

    const result = await cartService.getOrCreate(1);

    expect(cartRepository.save).toHaveBeenCalledWith({ userId: 1, status: 'active' });
    expect(result.status).toBe('active');
  });
});

describe('CartService - checkout', () => {
  test('debe descontar stock y cambiar el status a paid dentro de una transacción', async () => {
    const transaction = createTransaction();
    const cart = {
      ...mockActiveCart,
      CartItems: [{ productId: 10, cantidad: 2 }],
      reload: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const product = {
      id: 10,
      nombre: 'Camiseta',
      stock: 5,
      update: jest.fn().mockResolvedValue(undefined),
    };

    cartRepository.findActiveByUserId.mockResolvedValue(cart);
    sequelize.transaction.mockResolvedValue(transaction);
    Product.findByPk.mockResolvedValue(product);

    const result = await cartService.checkout(1);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(cart.reload).toHaveBeenCalledWith({
      include: [{ model: expect.any(Object) }],
      transaction,
    });
    expect(Product.findByPk).toHaveBeenCalledWith(10, { transaction, lock: transaction.LOCK.UPDATE });
    expect(product.update).toHaveBeenCalledWith({ stock: 3 }, { transaction });
    expect(cart.update).toHaveBeenCalledWith({ status: 'paid' }, { transaction });
    expect(transaction.commit).toHaveBeenCalled();
    expect(transaction.rollback).not.toHaveBeenCalled();
    expect(result).toBe(cart);
  });

  test('debe hacer rollback si no hay stock suficiente', async () => {
    const transaction = createTransaction();
    const cart = {
      ...mockActiveCart,
      CartItems: [{ productId: 10, cantidad: 6 }],
      reload: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const product = {
      id: 10,
      nombre: 'Camiseta',
      stock: 5,
      update: jest.fn().mockResolvedValue(undefined),
    };

    cartRepository.findActiveByUserId.mockResolvedValue(cart);
    sequelize.transaction.mockResolvedValue(transaction);
    Product.findByPk.mockResolvedValue(product);

    await expect(cartService.checkout(1)).rejects.toThrow('Stock insuficiente para Camiseta');

    expect(transaction.rollback).toHaveBeenCalled();
    expect(transaction.commit).not.toHaveBeenCalled();
    expect(product.update).not.toHaveBeenCalled();
    expect(cart.update).not.toHaveBeenCalled();
  });

  test('debe lanzar error si no hay cart activo', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(null);

    await expect(cartService.checkout(1)).rejects.toThrow('No hay un carrito activo');
  });
});

describe('CartService - getHistory', () => {
  test('debe retornar todos los carts del usuario', async () => {
    cartRepository.findAllByUserId.mockResolvedValue([mockPaidCart, mockActiveCart]);

    const result = await cartService.getHistory(1);

    expect(result).toHaveLength(2);
    expect(cartRepository.findAllByUserId).toHaveBeenCalledWith(1);
  });

  test('debe retornar array vacío si no hay historial', async () => {
    cartRepository.findAllByUserId.mockResolvedValue([]);

    const result = await cartService.getHistory(1);

    expect(result).toHaveLength(0);
  });
});
