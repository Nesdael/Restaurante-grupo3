import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MenuController } from './menu.controller.js';
import { MenuService } from './menu.service.js';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  const mockMenuService = {
    getFullMenu: vi.fn(),
    getActiveCategories: vi.fn(),
    getProductsByCategory: vi.fn(),
    getProductById: vi.fn(),
  };

  const mockCategory = {
    id: 'cat-uuid-1',
    name: 'Beverages',
  };

  const mockProduct = {
    id: 'prod-uuid-1',
    name: 'Iced Coffee',
    description: 'Cold brewed coffee with milk',
    price: 4.5,
    availability: 'AVAILABLE',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFullMenu', () => {
    it('should call MenuService.getFullMenu and return the full menu', async () => {
      const expectedResult = [{ ...mockCategory, products: [mockProduct] }];
      mockMenuService.getFullMenu.mockResolvedValue(expectedResult);

      const result = await controller.getFullMenu();

      expect(service.getFullMenu).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getActiveCategories', () => {
    it('should call MenuService.getActiveCategories and return active categories', async () => {
      const expectedResult = [mockCategory];
      mockMenuService.getActiveCategories.mockResolvedValue(expectedResult);

      const result = await controller.getActiveCategories();

      expect(service.getActiveCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProductsByCategory', () => {
    it('should call MenuService.getProductsByCategory with categoryId', async () => {
      const categoryId = 'cat-uuid-1';
      const expectedResult = { category: 'Beverages', products: [mockProduct] };
      mockMenuService.getProductsByCategory.mockResolvedValue(expectedResult);

      const result = await controller.getProductsByCategory(categoryId);

      expect(service.getProductsByCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProductById', () => {
    it('should call MenuService.getProductById with product id', async () => {
      const productId = 'prod-uuid-1';
      const expectedResult = { ...mockProduct, category: mockCategory };
      mockMenuService.getProductById.mockResolvedValue(expectedResult);

      const result = await controller.getProductById(productId);

      expect(service.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedResult);
    });
  });
});
