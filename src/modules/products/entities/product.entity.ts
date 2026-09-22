import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';
import { ProductAvailability } from '../enums/product-availability.enum.js';
import { ProductStatus } from '../enums/product-status.enum.js';

@Entity('products')
// RN-026: the price must be greater than zero, also enforced by the database.
@Check('"price" > 0')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  // numeric keeps exact cents. Postgres returns numeric as a string,
  // so the transformer turns it back into a number.
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price: number;

  // RN-027: a new product is ACTIVE by default.
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  // RN-028: a new product is AVAILABLE by default.
  @Column({
    type: 'enum',
    enum: ProductAvailability,
    default: ProductAvailability.AVAILABLE,
  })
  availability: ProductAvailability;

  // RN-025: every product belongs to an existing category.
  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}