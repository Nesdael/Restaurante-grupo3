import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
}
