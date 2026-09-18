import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entities/category.entity.js';
import { CategoriesController } from './category.controller.spec.js';
import { CategoriesService } from './category.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  // HU-004 (products) and HU-005 (public menu) need this service.
  exports: [CategoriesService],
})
export class CategoriesModule {}
