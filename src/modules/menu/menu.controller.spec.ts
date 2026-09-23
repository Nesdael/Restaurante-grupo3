import { Test, TestingModule } from '@nestjs/testing';

import { ProductAvailability } from '../products/enums/product-availability.enum.js';
import { MenuController } from './menu.controller.js';
import { MenuService } from './menu.service.js';

describe('MenuController', () => {
  let controller: MenuController;

  const serviceMock = {
    getFullMenu: vi.fn().mockResolvedValue([]),
    getActiveCategories: vi.fn().mockResolvedValue([]),
    getProductsByCategory: vi.fn().mockResolvedValue([]),
    getProduct: vi.fn().mockResolvedValue({ id: 'p1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [{ provide: MenuService, useValue: serviceMock }],
    }).compile();

    controller = module.get<MenuController>(MenuController);
  });

  it('returns the full menu', async () => {
    const query = { availability: ProductAvailability.AVAILABLE };

    await expect(controller.getFullMenu(query)).resolves.toEqual([]);
    expect(serviceMock.getFullMenu).toHaveBeenCalledWith(query);
  });

  it('returns the active categories', async () => {
    await expect(controller.getActiveCategories()).resolves.toEqual([]);
  });

  it('returns the products of a category', async () => {
    await controller.getProductsByCategory('drinks', {});
    expect(serviceMock.getProductsByCategory).toHaveBeenCalledWith(
      'drinks',
      {},
    );
  });

  it('returns one product', async () => {
    await expect(controller.getProduct('p1')).resolves.toEqual({ id: 'p1' });
  });
});
