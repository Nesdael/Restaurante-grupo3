import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Table } from '../tables/entities/table.entity.js';
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
}
