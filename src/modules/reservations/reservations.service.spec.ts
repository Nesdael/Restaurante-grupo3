import { ReservationsService } from './reservations.service.js';

// Minimal repository doubles. Each story adds the methods it needs.
const buildService = () => {
  const reservationsRepo = {};
  const tablesRepo = {};

  return {
    service: new ReservationsService(
      reservationsRepo as never,
      tablesRepo as never,
    ),
    reservationsRepo,
    tablesRepo,
  };
};

describe('ReservationsService', () => {
  it('is defined', () => {
    const { service } = buildService();

    expect(service).toBeDefined();
  });
});
