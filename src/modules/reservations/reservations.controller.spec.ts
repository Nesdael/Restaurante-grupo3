import { Test, TestingModule } from '@nestjs/testing';

import { ReservationsController } from './reservations.controller.js';
import { ReservationsService } from './reservations.service.js';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  // Each story adds the service methods its endpoints call.
  const serviceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
