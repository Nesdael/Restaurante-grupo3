import { ConflictException, NotFoundException } from '@nestjs/common';
import { TablesService } from './tables.service.js';
import { TableStatus } from './enums/table-status.enum.js';

// Minimal repository double: only the methods the service touches.
const buildService = (existing: unknown = null) => {
  const repo = {
    findOneBy: vi.fn().mockResolvedValue(existing),
    findBy: vi.fn().mockResolvedValue([]),
    create: vi.fn((dto) => dto),
    save: vi.fn((entity) =>
      Promise.resolve({ id: 'uuid', status: TableStatus.AVAILABLE, ...entity }),
    ),
  };
  return { service: new TablesService(repo as never), repo };
};

describe('TablesService', () => {
  it('creates a table with AVAILABLE status when the number is free (RN-018)', async () => {
    const { service } = buildService(null);
    const table = await service.create({ number: 1, capacity: 4, zone: 'A' });
    expect(table.status).toBe(TableStatus.AVAILABLE);
  });

  it('rejects a duplicate table number (RN-016)', async () => {
    const { service } = buildService({ id: 'x', number: 1 });
    await expect(
      service.create({ number: 1, capacity: 4, zone: 'A' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('forwards only the filters actually sent (TypeORM rejects undefined)', async () => {
    const { service, repo } = buildService(null);
    await service.findAll({ zone: 'A', status: undefined, capacity: undefined });
    expect(repo.findBy).toHaveBeenCalledWith({ zone: 'A' });
  });

  it('throws when a table is not found', async () => {
    const { service } = buildService(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
