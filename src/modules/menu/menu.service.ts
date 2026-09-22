import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/menu.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { CategoryStatus } from '../categories/enums/category-status.enum.js';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * GET /api/v1/menu
   * RN-031, RN-032, RN-033, RN-034, RN-035
   */
  async getFullMenu(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        status: CategoryStatus.ACTIVE, // RN-031: Only active categories
      },
      relations: {
        Product: true, // RN-034: Grouped by category
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  /**
   * GET /api/v1/menu/categories
   * RN-031
   */
  async getActiveCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        status: CategoryStatus.ACTIVE, // RN-031
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  /**
   * GET /api/v1/menu/categories/:categoryId/products
   * RN-031, RN-032, RN-033
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    // 1. Verify that parent category exists and is active (RN-031)
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        status: CategoryStatus.ACTIVE,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${categoryId} not found or inactive`,
      );
    }

    // 2. Retrieve active products for this category (RN-032, RN-033)
    return this.productRepository.find({
      where: {
        categoryId,
        status: CategoryStatus.ACTIVE, // RN-032
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        availability: true, // RN-033
      },
    });
  }

  /**
   * GET /api/v1/menu/products/:id
   * RN-031, RN-032, RN-033
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id, // Search by product ID
        status: CategoryStatus.ACTIVE, // RN-032: Product must be ACTIVE
        category: {
          status: CategoryStatus.ACTIVE, // RN-031: Parent category must be ACTIVE
        },
      },
      relations: {
        category: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        availability: true, // RN-033
        category: {
          id: true,
          name: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${id} not found or inactive`,
      );
    }

    return product;
  }
}
