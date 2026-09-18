import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CategoryStatus } from '../enums/category-status.enum.js';

export class UpdateCategoryStatusDto {
  // RN-024: only system-defined statuses are accepted.
  @ApiProperty({ enum: CategoryStatus })
  @IsEnum(CategoryStatus)
  status: CategoryStatus;
}
