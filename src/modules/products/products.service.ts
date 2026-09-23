import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UpdateProductStatusDto } from './dto/update-product-status.dto.js';
import { Product } from './entities/product.entity.js';
import { Category } from '../categories/entities/category.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    await this.ensureCategoryExists(createProductDto.categoryId);

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      await this.ensureCategoryExists(updateProductDto.categoryId);
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async updateStatus(
    id: string,
    updateProductStatusDto: UpdateProductStatusDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    product.status = updateProductStatusDto.status;
    return this.productsRepository.save(product);
  }

  async updateAvailability(
    id: string,
    updateProductAvailabilityDto: UpdateProductAvailabilityDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    product.availability = updateProductAvailabilityDto.availability;
    return this.productsRepository.save(product);
  }

  // RN-025: every product must belong to an existing category.
  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoriesRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  }
}
