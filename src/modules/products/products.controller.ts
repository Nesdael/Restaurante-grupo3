import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UpdateProductStatusDto } from './dto/update-product-status.dto.js';
import { ProductsService } from './products.service.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a menu product' })
  @ApiCreatedResponse({
    description:
      'Product created with status ACTIVE and availability AVAILABLE',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List every product' })
  @ApiOkResponse({ description: 'List of products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one product' })
  @ApiOkResponse({ description: 'The product' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ description: 'Product updated' })
  @ApiNotFoundResponse({ description: 'Product or category not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a product' })
  @ApiOkResponse({ description: 'Status updated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
  ) {
    return this.productsService.updateStatus(id, updateProductStatusDto);
  }

  @Patch(':id/availability')
  @ApiOperation({ summary: 'Change the availability of a product' })
  @ApiOkResponse({ description: 'Availability updated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  updateAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductAvailabilityDto: UpdateProductAvailabilityDto,
  ) {
    return this.productsService.updateAvailability(
      id,
      updateProductAvailabilityDto,
    );
  }
}
