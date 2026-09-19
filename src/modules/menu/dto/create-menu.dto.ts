import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateMenuDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
