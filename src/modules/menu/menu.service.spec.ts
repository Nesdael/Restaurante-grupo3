import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { MenuService } from './menu.service.js';
import { Product } from './entities/menu.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { CategoryStatus } from '../categories/enums/category-status.enum.js';

describe('MenuService', () => {
  let service: MenuService;
  let productRepository: { find: Mock; findOne: Mock };
  let categoryRepository: { find: Mock; findOne: Mock };

  const mockCategory = {
    id: 'cat-uuid-1',
    name: 'Beverages',
    description: 'Cold and hot drinks',
    status: CategoryStatus.ACTIVE,
    products: [],
  } as Category;

  const mockProduct = {
    id: 'prod-uuid-1',
    name: 'Iced Coffee',
    description: 'Cold brewed coffee with milk',
    price: 4.5,
    status: CategoryStatus.ACTIVE,
    availability: 'AVAILABLE' as any,
    categoryId: 'cat-uuid-1',
    category: mockCategory,
  } as Product;

  beforeEach(async () => {
    productRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
    };

    categoryRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFullMenu', () => {
    it('should return all active categories with active products (RN-031, RN-032, RN-034)', async () => {
      const mockMenu = [{ ...mockCategory, products: [mockProduct] }];
      categoryRepository.find.mockResolvedValue(mockMenu);

      const result = await service.getFullMenu();

      expect(categoryRepository.find).toHaveBeenCalledWith({
        where: { status: CategoryStatus.ACTIVE },
        relations: { products: true },
        select: {
          id: true,
          name: true,
        },
      });
      expect(result).toEqual(mockMenu);
    });
  });

  describe('getActiveCategories', () => {
    it('should return only active categories (RN-031)', async () => {
      const mockCategories = [mockCategory];
      categoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.getActiveCategories();

      expect(categoryRepository.find).toHaveBeenCalledWith({
        where: { status: CategoryStatus.ACTIVE },
        select: {
          id: true,
          name: true,
        },
      });
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for a valid active category', async () => {
      categoryRepository.findOne.mockResolvedValue(mockCategory);
      productRepository.find.mockResolvedValue([mockProduct]);

      const result = await service.getProductsByCategory('cat-uuid-1');

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'cat-uuid-1', status: CategoryStatus.ACTIVE },
      });
      expect(productRepository.find).toHaveBeenCalledWith({
        where: { categoryId: 'cat-uuid-1', status: CategoryStatus.ACTIVE },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          availability: true,
        },
      });
      expect(result).toEqual([mockProduct]);
    });

    it('should throw NotFoundException if category does not exist or is inactive', async () => {
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getProductsByCategory('invalid-cat-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProductById', () => {
    it('should return a product detail if active and parent category is active', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.getProductById('prod-uuid-1');

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'prod-uuid-1',
          status: CategoryStatus.ACTIVE,
          category: { status: CategoryStatus.ACTIVE },
        },
        relations: { category: true },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          availability: true,
          category: {
            id: true,
            name: true,
          },
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product is not found or inactive', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.getProductById('invalid-prod-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
