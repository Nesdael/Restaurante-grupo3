import { NotFoundException } from '@nestjs/common';

import { CategoryStatus } from '../categories/enums/category-status.enum.js';
import { ProductAvailability } from '../products/enums/product-availability.enum.js';
import { ProductStatus } from '../products/enums/product-status.enum.js';
import { MenuService } from './menu.service.js';

// Minimal repository doubles: only the methods the service touches.
const buildService = () => {
  const categoriesRepo = {
    find: vi.fn().mockResolvedValue([]),
    findOneBy: vi.fn().mockResolvedValue(null),
  };
  const productsRepo = {
    find: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
  };

  return {
    service: new MenuService(categoriesRepo as never, productsRepo as never),
    categoriesRepo,
    productsRepo,
  };
};

describe('MenuService', () => {
  it('groups the active products under their category (RN-034)', async () => {
    const { service, categoriesRepo, productsRepo } = buildService();
    categoriesRepo.find.mockResolvedValue([
      { id: 'drinks', name: 'Drinks' },
      { id: 'desserts', name: 'Desserts' },
    ]);
    productsRepo.find.mockResolvedValue([
      { id: 'p1', name: 'Lemonade', categoryId: 'drinks' },
      { id: 'p2', name: 'Cheesecake', categoryId: 'desserts' },
    ]);

    const menu = await service.getFullMenu();

    expect(menu).toEqual([
      {
        id: 'drinks',
        name: 'Drinks',
        products: [{ id: 'p1', name: 'Lemonade', categoryId: 'drinks' }],
      },
      {
        id: 'desserts',
        name: 'Desserts',
        products: [{ id: 'p2', name: 'Cheesecake', categoryId: 'desserts' }],
      },
    ]);
  });

  it('only asks for active categories and active products (RN-031, RN-032)', async () => {
    const { service, categoriesRepo, productsRepo } = buildService();
    categoriesRepo.find.mockResolvedValue([{ id: 'drinks', name: 'Drinks' }]);

    await service.getFullMenu();

    expect(categoriesRepo.find.mock.calls[0][0].where).toEqual({
      status: CategoryStatus.ACTIVE,
    });
    expect(productsRepo.find.mock.calls[0][0].where.status).toBe(
      ProductStatus.ACTIVE,
    );
  });

  it('returns an empty menu without querying products when there are no active categories', async () => {
    const { service, productsRepo } = buildService();

    await expect(service.getFullMenu()).resolves.toEqual([]);
    expect(productsRepo.find).not.toHaveBeenCalled();
  });

  it('passes the availability filter to the query', async () => {
    const { service, categoriesRepo, productsRepo } = buildService();
    categoriesRepo.findOneBy.mockResolvedValue({ id: 'drinks' });

    await service.getProductsByCategory('drinks', {
      availability: ProductAvailability.AVAILABLE,
    });

    expect(productsRepo.find.mock.calls[0][0].where).toEqual({
      categoryId: 'drinks',
      status: ProductStatus.ACTIVE,
      availability: ProductAvailability.AVAILABLE,
    });
  });

  it('does not add the availability filter when it was not sent', async () => {
    const { service, categoriesRepo, productsRepo } = buildService();
    categoriesRepo.findOneBy.mockResolvedValue({ id: 'drinks' });

    await service.getProductsByCategory('drinks');

    expect(productsRepo.find.mock.calls[0][0].where).toEqual({
      categoryId: 'drinks',
      status: ProductStatus.ACTIVE,
    });
  });

  it('rejects the products of a category that does not exist or is inactive', async () => {
    const { service } = buildService();

    await expect(
      service.getProductsByCategory('missing'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects a product that does not exist or is not visible in the menu', async () => {
    const { service } = buildService();

    await expect(service.getProduct('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns a visible product with its category', async () => {
    const { service, productsRepo } = buildService();
    const product = {
      id: 'p1',
      name: 'Lemonade',
      category: { id: 'drinks', name: 'Drinks' },
    };
    productsRepo.findOne.mockResolvedValue(product);

    await expect(service.getProduct('p1')).resolves.toEqual(product);
  });
});
