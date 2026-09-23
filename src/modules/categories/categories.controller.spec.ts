import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { CategoryStatus } from './enums/category-status.enum.js';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const category = {
    id: 'a1b2c3d4-0000-0000-0000-000000000000',
    name: 'Drinks',
    description: 'Soft drinks and juices',
    status: CategoryStatus.ACTIVE,
  };

  // The controller only delegates, so the service is replaced by a double.
  const serviceMock = {
    create: vi.fn().mockResolvedValue(category),
    findAll: vi.fn().mockResolvedValue([category]),
    findOne: vi.fn().mockResolvedValue(category),
    update: vi.fn().mockResolvedValue(category),
    updateStatus: vi.fn().mockResolvedValue(category),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a category', async () => {
    const dto = { name: 'Drinks', description: 'Soft drinks and juices' };

    await expect(controller.create(dto)).resolves.toEqual(category);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('lists categories', async () => {
    await expect(controller.findAll()).resolves.toEqual([category]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns a single category', async () => {
    await expect(controller.findOne(category.id)).resolves.toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith(category.id);
  });

  it('updates a category', async () => {
    const dto = { description: 'Updated description' };

    await expect(controller.update(category.id, dto)).resolves.toEqual(
      category,
    );
    expect(service.update).toHaveBeenCalledWith(category.id, dto);
  });

  it('updates only the status', async () => {
    const dto = { status: CategoryStatus.INACTIVE };

    await expect(controller.updateStatus(category.id, dto)).resolves.toEqual(
      category,
    );
    expect(service.updateStatus).toHaveBeenCalledWith(category.id, dto);
  });
});
