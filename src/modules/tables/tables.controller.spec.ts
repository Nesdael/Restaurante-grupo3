import { Test, TestingModule } from '@nestjs/testing';

import { TablesController } from './tables.controller.js';
import { TablesService } from './tables.service.js';
import { TableStatus } from './enums/table-status.enum.js';

describe('TablesController', () => {
  let controller: TablesController;
  let service: TablesService;

  const table = {
    id: 'a1b2c3d4-0000-0000-0000-000000000000',
    number: 1,
    capacity: 4,
    zone: 'Terrace',
    status: TableStatus.AVAILABLE,
  };

  // The controller only delegates, so the service is replaced by a double.
  const serviceMock = {
    create: vi.fn().mockResolvedValue(table),
    findAll: vi.fn().mockResolvedValue([table]),
    findOne: vi.fn().mockResolvedValue(table),
    update: vi.fn().mockResolvedValue(table),
    updateStatus: vi.fn().mockResolvedValue(table),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [{ provide: TablesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TablesController>(TablesController);
    service = module.get<TablesService>(TablesService);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a table', async () => {
    const dto = { number: 1, capacity: 4, zone: 'Terrace' };

    await expect(controller.create(dto)).resolves.toEqual(table);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('lists tables passing the filters through', async () => {
    const filters = { zone: 'Terrace' };

    await expect(controller.findAll(filters)).resolves.toEqual([table]);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('returns a single table', async () => {
    await expect(controller.findOne(table.id)).resolves.toEqual(table);
    expect(service.findOne).toHaveBeenCalledWith(table.id);
  });

  it('updates a table', async () => {
    const dto = { capacity: 6 };

    await expect(controller.update(table.id, dto)).resolves.toEqual(table);
    expect(service.update).toHaveBeenCalledWith(table.id, dto);
  });

  it('updates only the status', async () => {
    const dto = { status: TableStatus.OCCUPIED };

    await expect(controller.updateStatus(table.id, dto)).resolves.toEqual(
      table,
    );
    expect(service.updateStatus).toHaveBeenCalledWith(table.id, dto);
  });
});
