import { BadRequestException } from '@nestjs/common';

import { ReservationsService } from './reservations.service.js';

// Minimal repository doubles. Each story adds the methods it needs.
const buildService = (
  freeTables: unknown[] = [],
  overlapping: unknown[] = [],
) => {
  const reservationsRepo = {
    find: vi.fn().mockResolvedValue(overlapping),
  };
  const tablesRepo = {
    find: vi.fn().mockResolvedValue(freeTables),
  };

  return {
    service: new ReservationsService(
      reservationsRepo as never,
      tablesRepo as never,
    ),
    reservationsRepo,
    tablesRepo,
  };
};

// A datetime safely in the future, so RN-037 does not reject the query.
const futureDate = () =>
  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

describe('ReservationsService', () => {
  it('is defined', () => {
    const { service } = buildService();

    expect(service).toBeDefined();
  });

  it('finds only AVAILABLE tables with capacity >= guests (RN-038, RN-039)', async () => {
    const { service, tablesRepo } = buildService();

    const start = new Date('2026-10-01T19:00:00-05:00');
    const end = new Date('2026-10-01T21:00:00-05:00');
    await service.findFreeTables(start, end, 4);

    const where = tablesRepo.find.mock.calls[0][0].where;
    expect(where.status).toBe('AVAILABLE');
    expect(where.capacity).toBeDefined();
  });

  it('excludes tables with a conflicting reservation (RN-040)', async () => {
    const { service, tablesRepo } = buildService([], [{ tableId: 'busy-1' }]);

    const start = new Date('2026-10-01T19:00:00-05:00');
    const end = new Date('2026-10-01T21:00:00-05:00');
    await service.findFreeTables(start, end, 4);

    // Busy table ids are forwarded so the tables query can exclude them.
    expect(tablesRepo.find.mock.calls[0][0].where.id).toBeDefined();
  });

  it('rejects a query in the past (RN-037)', async () => {
    const { service } = buildService();

    await expect(
      service.checkAvailability({
        startsAt: '2000-01-01T19:00:00-05:00',
        guests: 2,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reports clear messaging when no table is available', async () => {
    const { service } = buildService([]);

    const result = await service.checkAvailability({
      startsAt: futureDate(),
      guests: 2,
    });

    expect(result.available).toBe(false);
    expect(result.count).toBe(0);
    expect(result.message).toMatch(/no tables available/i);
  });

  it('returns the free tables when there is availability', async () => {
    const { service } = buildService([{ id: 't1' }, { id: 't2' }]);

    const result = await service.checkAvailability({
      startsAt: futureDate(),
      guests: 2,
    });

    expect(result.available).toBe(true);
    expect(result.count).toBe(2);
  });
});
