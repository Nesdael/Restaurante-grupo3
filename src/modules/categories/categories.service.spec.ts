import { ConflictException, NotFoundException } from '@nestjs/common';

import { CategoriesService } from './categories.service.js';
import { CategoryStatus } from './enums/category-status.enum.js';

// Minimal repository double: only the methods the service touches.
const buildService = (existing: unknown = null) => {
  const repo = {
    findOneBy: vi.fn().mockResolvedValue(existing),
    find: vi.fn().mockResolvedValue([]),
    findBy: vi.fn().mockResolvedValue([]),
    create: vi.fn((dto) => dto),
    save: vi.fn((entity) =>
      Promise.resolve({
        id: 'uuid',
        status: CategoryStatus.ACTIVE,
        ...entity,
      }),
    ),
  };
  return { service: new CategoriesService(repo as never), repo };
};

describe('CategoriesService', () => {
  it('creates a category with ACTIVE status when the name is free (RN-022)', async () => {
    const { service } = buildService(null);

    const category = await service.create({ name: 'Drinks' });

    expect(category.status).toBe(CategoryStatus.ACTIVE);
  });

  it('rejects a duplicate category name (RN-021)', async () => {
    const { service } = buildService({ id: 'x', name: 'Drinks' });

    await expect(service.create({ name: 'Drinks' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('throws when a category is not found', async () => {
    const { service } = buildService(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists only ACTIVE categories for the public menu (RN-023)', async () => {
    const { service, repo } = buildService(null);

    await service.findAllActive();

    expect(repo.findBy).toHaveBeenCalledWith({
      status: CategoryStatus.ACTIVE,
    });
  });

  it('changes the status of an existing category', async () => {
    const { service } = buildService({
      id: 'uuid',
      name: 'Drinks',
      status: CategoryStatus.ACTIVE,
    });

    const category = await service.updateStatus('uuid', {
      status: CategoryStatus.INACTIVE,
    });

    expect(category.status).toBe(CategoryStatus.INACTIVE);
  });
});
