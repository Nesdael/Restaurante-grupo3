import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Table } from '../../tables/entities/table.entity.js';
import { ReservationStatus } from '../enums/reservation-status.enum.js';

// The only Reservation entity of the project. Every Sprint 2 story (HU-006 to
// HU-013) works on this table; nobody creates another entity for reservations.
@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  customerName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'int' })
  guests: number;

  // Date and time of the reservation. endsAt = startsAt + RESERVATION_DURATION_MINUTES.
  // Two reservations of the same table overlap when
  // existing.startsAt < new.endsAt AND existing.endsAt > new.startsAt (RN-040, RN-045).
  @Column({ type: 'timestamptz' })
  startsAt: Date;

  @Column({ type: 'timestamptz' })
  endsAt: Date;

  // RN-046: a new reservation is PENDING by default.
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'uuid' })
  tableId: string;

  @ManyToOne(() => Table, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tableId' })
  table: Relation<Table>;

  // When each status change happened. Null until it happens.
  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt: Date | null; // RN-069 (HU-011)

  @Column({ type: 'timestamptz', nullable: true })
  checkedInAt: Date | null; // RN-074 (HU-012)

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date | null; // RN-064 (HU-010)

  @Column({ type: 'timestamptz', nullable: true })
  noShowAt: Date | null; // RN-081 (HU-013)

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
