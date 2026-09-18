import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryStatus } from '../entities/category.entity.js';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;
}