import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service.js';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // GET /api/v1/menu
  @Get()
  @ApiOperation({
    summary: 'Get full public menu grouped by active categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns full menu grouped by active category.',
  })
  getFullMenu() {
    return this.menuService.getFullMenu();
  }

  // GET /api/v1/menu/categories
  @Get('categories')
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of active categories.',
  })
  getActiveCategories() {
    return this.menuService.getActiveCategories();
  }

  // GET /api/v1/menu/categories/:categoryId/products
  @Get('categories/:categoryId/products')
  @ApiOperation({
    summary: 'Get active products for a specific active category',
  })
  @ApiResponse({ status: 200, description: 'Returns category products.' })
  @ApiResponse({ status: 404, description: 'Category not found or inactive.' })
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.menuService.getProductsByCategory(categoryId);
  }

  // GET /api/v1/menu/products/:id
  @Get('products/:id')
  @ApiOperation({ summary: 'Get details of a single active product' })
  @ApiResponse({ status: 200, description: 'Returns product details.' })
  @ApiResponse({ status: 404, description: 'Product not found or inactive.' })
  getProductById(@Param('id') id: string) {
    return this.menuService.getProductById(id);
  }
}
