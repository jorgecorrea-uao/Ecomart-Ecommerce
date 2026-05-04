const cartService = require('../services/cart.service');
const cartRepository = require('../repositories/cart.repository');

jest.mock('../repositories/cart.repository');

const mockActiveCart = { id: 1, userId: 1, status: 'active' };
const mockPaidCart = { id: 1, userId: 1, status: 'paid' };

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
  test('debe cambiar el status a paid', async () => {
    cartRepository.findActiveByUserId.mockResolvedValue(mockActiveCart);
    cartRepository.update.mockResolvedValue(mockPaidCart);

    const result = await cartService.checkout(1);

    expect(cartRepository.update).toHaveBeenCalledWith(1, { status: 'paid' });
    expect(result.status).toBe('paid');
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
