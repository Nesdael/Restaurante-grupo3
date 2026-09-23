import { NotFoundException } from '@nestjs/common';

import { ProductStatus } from './enums/product-status.enum.js';
import { ProductAvailability } from './enums/product-availability.enum.js';
import { ProductsService } from './products.service.js';

// Minimal repository doubles: only the methods the service touches.
const buildService = (existingCategory: unknown = { id: 'category-uuid' }) => {
  const productsRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((dto) => dto),
    save: vi.fn((entity) =>
      Promise.resolve({
        id: 'product-uuid',
        status: ProductStatus.ACTIVE,
        availability: ProductAvailability.AVAILABLE,
        ...entity,
      }),
    ),
    find: vi.fn().mockResolvedValue([]),
  };
  const categoriesRepo = {
    findOneBy: vi.fn().mockResolvedValue(existingCategory),
  };

  return {
    service: new ProductsService(
      productsRepo as never,
      categoriesRepo as never,
    ),
    productsRepo,
    categoriesRepo,
  };
};

describe('ProductsService', () => {
  it('creates a product with ACTIVE status and AVAILABLE availability by default (RN-027, RN-028)', async () => {
    const { service } = buildService();

    const product = await service.create({
      name: 'Limonada Natural',
      price: 8.5,
      categoryId: 'category-uuid',
    });

    expect(product.status).toBe(ProductStatus.ACTIVE);
    expect(product.availability).toBe(ProductAvailability.AVAILABLE);
  });

  it('rejects a product whose category does not exist (RN-025)', async () => {
    const { service } = buildService(null);

    await expect(
      service.create({
        name: 'Limonada Natural',
        price: 8.5,
        categoryId: 'missing',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when a product is not found', async () => {
    const { service, productsRepo } = buildService();
    productsRepo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('changes the status of an existing product', async () => {
    const { service, productsRepo } = buildService();
    productsRepo.findOneBy.mockResolvedValue({
      id: 'product-uuid',
      status: ProductStatus.ACTIVE,
    });

    const product = await service.updateStatus('product-uuid', {
      status: ProductStatus.INACTIVE,
    });

    expect(product.status).toBe(ProductStatus.INACTIVE);
  });

  it('changes the availability of an existing product', async () => {
    const { service, productsRepo } = buildService();
    productsRepo.findOneBy.mockResolvedValue({
      id: 'product-uuid',
      availability: ProductAvailability.AVAILABLE,
    });

    const product = await service.updateAvailability('product-uuid', {
      availability: ProductAvailability.UNAVAILABLE,
    });

    expect(product.availability).toBe(ProductAvailability.UNAVAILABLE);
  });

  it('rejects an update that moves the product to a category that does not exist (RN-025)', async () => {
    const { service, productsRepo, categoriesRepo } = buildService();
    productsRepo.findOneBy.mockResolvedValue({
      id: 'product-uuid',
      categoryId: 'category-uuid',
    });
    categoriesRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.update('product-uuid', { categoryId: 'missing' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
