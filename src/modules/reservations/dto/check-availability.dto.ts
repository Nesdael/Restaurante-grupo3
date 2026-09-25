import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsPositive, Matches } from 'class-validator';

// Query for GET /reservations/availability (HU-006).
// date + time are Colombia time; toStartsAt() turns them into startsAt.
// RN-037 (not in the past) is checked in the service, against the current time.
export class CheckAvailabilityDto {
  // strict rejects impossible dates such as 2026-02-30.
  @ApiProperty({ example: '2026-10-01', description: 'YYYY-MM-DD' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string;

  @ApiProperty({ example: '19:00', description: 'HH:mm, 24-hour' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'time must be HH:mm' })
  time: string;

  // RN-036: party size must be greater than zero.
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  guests: number;
}
