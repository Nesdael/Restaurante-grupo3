import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import { Table } from '../tables/entities/table.entity.js';
import { TableStatus } from '../tables/enums/table-status.enum.js';
import { CheckAvailabilityDto } from './dto/check-availability.dto.js';
import { Reservation } from './entities/reservation.entity.js';
import { ReservationStatus } from './enums/reservation-status.enum.js';

// How long a reservation keeps its table busy.
export const RESERVATION_DURATION_MINUTES = 120;

// Statuses that keep a table busy. CANCELLED and NO_SHOW free it (RN-063, RN-079).
export const BLOCKING_STATUSES = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CHECKED_IN,
];

/**
 * Agreed method names, so every story adds its own without conflicts:
 *
 * - HU-006  findFreeTables(startsAt, endsAt, guests, excludeReservationId?)
 *           checkAvailability(query)
 * - HU-007  create(dto)            -> uses findFreeTables()
 * - HU-008  findAll(), findOne(id) -> findOne() is reused by HU-009 to HU-013
 * - HU-009  update(id, dto)        -> uses findFreeTables(..., id)
 * - HU-010  cancel(id)
 * - HU-011  confirm(id)
 * - HU-012  checkIn(id)
 * - HU-013  markNoShow(id)
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Table)
    private readonly tablesRepository: Repository<Table>,
  ) {}

  // HU-006: tables that can take the party in the requested window.
  // RN-038/RN-041: only AVAILABLE tables. RN-039: capacity >= guests.
  // RN-040: no reservation in BLOCKING_STATUSES overlapping the window.
  // excludeReservationId lets HU-009 update a reservation without it clashing
  // with itself.
  async findFreeTables(
    startsAt: Date,
    endsAt: Date,
    guests: number,
    excludeReservationId?: string,
  ): Promise<Table[]> {
    // Overlap: existing.startsAt < new.endsAt AND existing.endsAt > new.startsAt.
    const overlapping = await this.reservationsRepository.find({
      where: {
        status: In(BLOCKING_STATUSES),
        startsAt: LessThan(endsAt),
        endsAt: MoreThan(startsAt),
        ...(excludeReservationId ? { id: Not(excludeReservationId) } : {}),
      },
      select: { tableId: true },
    });

    const busyTableIds = overlapping.map((reservation) => reservation.tableId);

    return this.tablesRepository.find({
      where: {
        status: TableStatus.AVAILABLE,
        capacity: MoreThanOrEqual(guests),
        ...(busyTableIds.length > 0 ? { id: Not(In(busyTableIds)) } : {}),
      },
      order: { number: 'ASC' },
    });
  }

  // HU-006: handler for GET /reservations/availability.
  async checkAvailability(query: CheckAvailabilityDto) {
    const startsAt = new Date(query.startsAt);

    // RN-037: a past date or time cannot be queried.
    if (startsAt.getTime() < Date.now()) {
      throw new BadRequestException(
        'Cannot check availability for a past date',
      );
    }

    const endsAt = new Date(
      startsAt.getTime() + RESERVATION_DURATION_MINUTES * 60_000,
    );

    const tables = await this.findFreeTables(startsAt, endsAt, query.guests);

    return {
      startsAt,
      endsAt,
      guests: query.guests,
      available: tables.length > 0,
      count: tables.length,
      tables,
      message:
        tables.length > 0
          ? `${tables.length} table(s) available`
          : 'No tables available for the selected time and party size',
    };
  }
}
