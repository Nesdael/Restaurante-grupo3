import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CheckAvailabilityDto } from './dto/check-availability.dto.js';
import { ReservationsService } from './reservations.service.js';

/**
 * Route order matters: GET /reservations/availability (HU-006) must be declared
 * BEFORE GET /reservations/:id (HU-008). Otherwise Nest takes "availability" as
 * an id and ParseUUIDPipe answers 400.
 *
 * GET    /reservations/availability   HU-006
 * POST   /reservations                HU-007
 * GET    /reservations                HU-008
 * GET    /reservations/:id            HU-008
 * PATCH  /reservations/:id            HU-009
 * PATCH  /reservations/:id/cancel     HU-010
 * PATCH  /reservations/:id/confirm    HU-011
 * PATCH  /reservations/:id/check-in   HU-012
 * PATCH  /reservations/:id/no-show    HU-013
 */
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Declared before GET /reservations/:id (HU-008) on purpose, so Nest does not
  // read "availability" as an id.
  @Get('availability')
  @ApiOperation({
    summary: 'Check table availability for a date-time and party size',
  })
  @ApiResponse({ status: 200, description: 'Availability result' })
  @ApiResponse({
    status: 400,
    description: 'Invalid or past date, or party size not greater than zero',
  })
  checkAvailability(@Query() query: CheckAvailabilityDto) {
    return this.reservationsService.checkAvailability(query);
  }

  @Get()
  @ApiOperation({ summary: 'List every reservation' })
  @ApiOkResponse({ description: 'List of reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one reservation' })
  @ApiOkResponse({ description: 'The reservation' })
  @ApiNotFoundResponse({ description: 'Reservation not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.findOne(id);
  }
}