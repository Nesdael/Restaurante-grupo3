import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service.js';

@ApiTags('Health')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check that the service is up' })
  @ApiOkResponse({
    schema: {
      example: { status: 'ok', service: 'restaurant-api' },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
