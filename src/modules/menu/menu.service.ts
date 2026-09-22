import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity.js';
import { CategoryStatus } from '../categories/enums/category-status.enum.js';
import { Product } from '../products/entities/product.entity.js';
import { ProductStatus } from '../products/enums/product-status.enum.js';
import { MenuQueryDto } from './dto/menu-query.dto.js';

// Fields a customer can see. status is left out because the menu
// only ever shows ACTIVE products.
const PUBLIC_PRODUCT_FIELDS = {
  id: true,
  name: true,
  description: true,
  price: true,
  availability: true, // RN-033: UNAVAILABLE products are shown as such
  categoryId: true,
} as const;

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // GET /menu: active categories with their active products (RN-031, RN-032, RN-034).
  async getFullMenu(query: MenuQueryDto = {}) {
    const categories = await this.getActiveCategories();

    if (categories.length === 0) {
      return [];
    }

    const products = await this.productsRepository.find({
      where: {
        categoryId: In(categories.map((category) => category.id)),
        status: ProductStatus.ACTIVE, // RN-032
        // TypeORM rejects undefined values in `where`, so the filter is
        // only added when it was sent.
        ...(query.availability && { availability: query.availability }),
      },
      select: PUBLIC_PRODUCT_FIELDS,
      order: { name: 'ASC' },
    });

    return categories.map((category) => ({
      ...category,
      products: products.filter(
        (product) => product.categoryId === category.id,
      ),
    }));
  }

  // GET /menu/categories (RN-031).
  getActiveCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { status: CategoryStatus.ACTIVE },
      select: { id: true, name: true },
      order: { name: 'ASC' },
    });
  }

  // GET /menu/categories/:categoryId/products (RN-031, RN-032).
  async getProductsByCategory(
    categoryId: string,
    query: MenuQueryDto = {},
  ): Promise<Product[]> {
    const category = await this.categoriesRepository.findOneBy({
      id: categoryId,
      status: CategoryStatus.ACTIVE,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    return this.productsRepository.find({
      where: {
        categoryId,
        status: ProductStatus.ACTIVE,
        ...(query.availability && { availability: query.availability }),
      },
      select: PUBLIC_PRODUCT_FIELDS,
      order: { name: 'ASC' },
    });
  }

  // GET /menu/products/:id: only an ACTIVE product of an ACTIVE category.
  async getProduct(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: {
        id,
        status: ProductStatus.ACTIVE,
        category: { status: CategoryStatus.ACTIVE },
      },
      relations: { category: true },
      select: { ...PUBLIC_PRODUCT_FIELDS, category: { id: true, name: true } },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }
}
