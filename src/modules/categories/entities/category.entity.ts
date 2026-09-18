import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryStatus } from '../enums/category-status.enum.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // RN-021: category name is unique.
  @Column({ type: 'varchar', length: 60, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  // RN-022: a new category is ACTIVE by default.
  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;
}
