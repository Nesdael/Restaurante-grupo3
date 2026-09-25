import { Test, TestingModule } from '@nestjs/testing';

import { ReservationsController } from './reservations.controller.js';
import { ReservationsService } from './reservations.service.js';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const reservation = { id: 'r1', customerName: 'Carlos Perez' };

  // Each story adds the service methods its endpoints call.
  const serviceMock = {
    findAll: vi.fn().mockResolvedValue([reservation]),
    findOne: vi.fn().mockResolvedValue(reservation),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  it('lists reservations', async () => {
    await expect(controller.findAll()).resolves.toEqual([reservation]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns one reservation', async () => {
    await expect(controller.findOne(reservation.id)).resolves.toEqual(
      reservation,
    );
    expect(service.findOne).toHaveBeenCalledWith(reservation.id);
  });
});
