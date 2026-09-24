import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsPositive } from 'class-validator';

// Query for GET /reservations/availability (HU-006).
export class CheckAvailabilityDto {
  // Start of the requested window. endsAt = startsAt + RESERVATION_DURATION_MINUTES.
  // RN-037 (not in the past) is checked in the service, against the current time.
  @ApiProperty({ example: '2026-10-01T19:00:00-05:00' })
  @IsDateString()
  startsAt: string;

  // RN-036: party size must be greater than zero.
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  guests: number;
}
