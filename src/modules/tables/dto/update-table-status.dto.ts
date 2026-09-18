import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TableStatus } from '../enums/table-status.enum.js';

export class UpdateTableStatusDto {
  // RN-020: only system-defined statuses are accepted.
  @ApiProperty({ enum: TableStatus })
  @IsEnum(TableStatus)
  status: TableStatus;
}
