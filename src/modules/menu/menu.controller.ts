import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { MenuQueryDto } from './dto/menu-query.dto.js';
import { MenuService } from './menu.service.js';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({
    summary: 'Full menu: active categories with their active products',
  })
  @ApiOkResponse({ description: 'Menu grouped by category' })
  getFullMenu(@Query() query: MenuQueryDto) {
    return this.menuService.getFullMenu(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List the active categories' })
  @ApiOkResponse({ description: 'Active categories' })
  getActiveCategories() {
    return this.menuService.getActiveCategories();
  }

  @Get('categories/:categoryId/products')
  @ApiOperation({ summary: 'Active products of an active category' })
  @ApiOkResponse({ description: 'Products of the category' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Category not found or inactive' })
  getProductsByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query() query: MenuQueryDto,
  ) {
    return this.menuService.getProductsByCategory(categoryId, query);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Detail of an active product' })
  @ApiOkResponse({ description: 'The product with its category' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Product not found or inactive' })
  getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.getProduct(id);
  }
}
