import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../categories/entities/category.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { MenuController } from './menu.controller.js';
import { MenuService } from './menu.service.js';

// The menu only reads data: it reuses the Category and Product entities
// from HU-003 and HU-004 instead of defining its own.
@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
