import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TableStatus } from '../enums/table-status.enum.js';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // RN-016: table number is unique.
  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'varchar', length: 50 })
  zone: string;

  // RN-018: a new table is AVAILABLE by default.
  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;
}
