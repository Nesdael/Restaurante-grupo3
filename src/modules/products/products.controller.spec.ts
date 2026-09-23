import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { ProductStatus } from './enums/product-status.enum.js';
import { ProductAvailability } from './enums/product-availability.enum.js';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const product = {
    id: 'a1b2c3d4-0000-0000-0000-000000000000',
    name: 'Limonada Natural',
    price: 8.5,
    status: ProductStatus.ACTIVE,
    availability: ProductAvailability.AVAILABLE,
    categoryId: 'category-uuid',
  };

  const serviceMock = {
    create: vi.fn().mockResolvedValue(product),
    findAll: vi.fn().mockResolvedValue([product]),
    findOne: vi.fn().mockResolvedValue(product),
    update: vi.fn().mockResolvedValue(product),
    updateStatus: vi.fn().mockResolvedValue(product),
    updateAvailability: vi.fn().mockResolvedValue(product),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a product', async () => {
    const dto = {
      name: 'Limonada Natural',
      price: 8.5,
      categoryId: 'category-uuid',
    };

    await expect(controller.create(dto)).resolves.toEqual(product);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('lists products', async () => {
    await expect(controller.findAll()).resolves.toEqual([product]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns a single product', async () => {
    await expect(controller.findOne(product.id)).resolves.toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith(product.id);
  });

  it('updates a product', async () => {
    const dto = { price: 9.5 };

    await expect(controller.update(product.id, dto)).resolves.toEqual(product);
    expect(service.update).toHaveBeenCalledWith(product.id, dto);
  });

  it('updates only the status', async () => {
    const dto = { status: ProductStatus.INACTIVE };

    await expect(controller.updateStatus(product.id, dto)).resolves.toEqual(
      product,
    );
    expect(service.updateStatus).toHaveBeenCalledWith(product.id, dto);
  });

  it('updates only the availability', async () => {
    const dto = { availability: ProductAvailability.UNAVAILABLE };

    await expect(
      controller.updateAvailability(product.id, dto),
    ).resolves.toEqual(product);
    expect(service.updateAvailability).toHaveBeenCalledWith(product.id, dto);
  });
});
