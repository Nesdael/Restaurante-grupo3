import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  // Lets other modules (menu, HU-005) inject Repository<Product>.
  exports: [TypeOrmModule],
})
export class ProductsModule {}