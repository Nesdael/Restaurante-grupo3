import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import {
  EnvConfig,
  validateEnv,
  databaseConfiguration,
} from './config/index.js';
import { TablesModule } from './modules/tables/tables.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { MenuModule } from './modules/menu/menu.module.js';
import { ReservationsModule } from './modules/reservations/reservations.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Reads the .env file, validates it and makes it available app-wide.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      validate: validateEnv,
    }),

    // PostgreSQL connection. Feature modules hook into this one.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfiguration,
    }),

    // NestJS telemetry
    ObserveModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.getOrThrow('observe'),
      }),
    }),

    // Modules
    TablesModule,
    CategoriesModule,
    ProductsModule,
    MenuModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
