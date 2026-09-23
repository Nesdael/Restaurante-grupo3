import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Table } from '../tables/entities/table.entity.js';
import { Reservation } from './entities/reservation.entity.js';
import { ReservationsController } from './reservations.controller.js';
import { ReservationsService } from './reservations.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Table])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
