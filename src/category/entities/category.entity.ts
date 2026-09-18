import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryStatus {
ACTIVE = 'ACTIVE',
INACTIVE = 'INACTIVE',
}

@Entity('categories')
export class Category {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ unique: true })
name: string;

@Column()
description: string;

@Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
})
status: CategoryStatus;
}