const productService = require('../services/product.service');
const productRepository = require('../repositories/product.repository');

jest.mock('../repositories/product.repository');

const mockProduct = { id: 1, nombre: 'Camiseta', descripcion: 'Tela orgánica', precio: 29.99, stock: 10, categoria: 'Ropa' };

beforeEach(() => jest.clearAllMocks());

describe('ProductService - getAll', () => {
  test('debe retornar lista paginada de productos', async () => {
    productRepository.findAll.mockResolvedValue({ total: 1, page: 1, limit: 10, data: [mockProduct] });

    const result = await productService.getAll({});

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('debe filtrar por categoria', async () => {
    productRepository.findAll.mockResolvedValue({ total: 1, page: 1, limit: 10, data: [mockProduct] });

    await productService.getAll({ categoria: 'Ropa' });

    expect(productRepository.findAll).toHaveBeenCalledWith({ categoria: 'Ropa', page: undefined, limit: undefined });
  });
});

describe('ProductService - getById', () => {
  test('debe retornar el producto si existe', async () => {
    productRepository.findById.mockResolvedValue(mockProduct);

    const result = await productService.getById(1);

    expect(result.id).toBe(1);
    expect(result.nombre).toBe('Camiseta');
  });

  test('debe lanzar error si el producto no existe', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.getById(99)).rejects.toThrow('Producto no encontrado');
  });
});

describe('ProductService - create', () => {
  test('debe crear un producto correctamente', async () => {
    productRepository.save.mockResolvedValue(mockProduct);

    const result = await productService.create({ nombre: 'Camiseta', precio: 29.99, stock: 10, categoria: 'Ropa' });

    expect(result.nombre).toBe('Camiseta');
    expect(productRepository.save).toHaveBeenCalledTimes(1);
  });

  test('debe lanzar error si el precio es 0 o negativo', async () => {
    await expect(productService.create({ nombre: 'X', precio: 0 })).rejects.toThrow('El precio debe ser mayor a 0');
    await expect(productService.create({ nombre: 'X', precio: -5 })).rejects.toThrow('El precio debe ser mayor a 0');
  });

  test('debe lanzar error si el stock es negativo', async () => {
    await expect(productService.create({ nombre: 'X', precio: 10, stock: -1 })).rejects.toThrow('El stock no puede ser negativo');
  });

  test('debe lanzar error si faltan campos obligatorios', async () => {
    await expect(productService.create({ descripcion: 'Sin nombre ni precio' })).rejects.toThrow('Nombre y precio son obligatorios');
  });
});

describe('ProductService - update', () => {
  test('debe actualizar el producto correctamente', async () => {
    const updated = { ...mockProduct, precio: 39.99 };
    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.update.mockResolvedValue(updated);

    const result = await productService.update(1, { precio: 39.99 });

    expect(result.precio).toBe(39.99);
  });

  test('debe lanzar error si el producto no existe', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.update(99, { precio: 10 })).rejects.toThrow('Producto no encontrado');
  });

  test('debe lanzar error si el nuevo precio es inválido', async () => {
    productRepository.findById.mockResolvedValue(mockProduct);

    await expect(productService.update(1, { precio: -1 })).rejects.toThrow('El precio debe ser mayor a 0');
  });
});

describe('ProductService - delete', () => {
  test('debe eliminar el producto correctamente', async () => {
    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.delete.mockResolvedValue();

    await expect(productService.delete(1)).resolves.not.toThrow();
    expect(productRepository.delete).toHaveBeenCalledWith(1);
  });

  test('debe lanzar error si el producto no existe', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.delete(99)).rejects.toThrow('Producto no encontrado');
  });
});

describe('ProductService - updateStock', () => {
  test('debe actualizar el stock correctamente', async () => {
    const updated = { ...mockProduct, stock: 50 };
    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.update.mockResolvedValue(updated);

    const result = await productService.updateStock(1, 50);

    expect(result.stock).toBe(50);
  });

  test('debe lanzar error si el nuevo stock es negativo', async () => {
    productRepository.findById.mockResolvedValue(mockProduct);

    await expect(productService.updateStock(1, -5)).rejects.toThrow('El stock no puede ser negativo');
  });

  test('debe lanzar error si el producto no existe', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(productService.updateStock(99, 10)).rejects.toThrow('Producto no encontrado');
  });
});
