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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { UpdateCategoryStatusDto } from './dto/update-category-status.dto.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a menu category' })
  @ApiCreatedResponse({ description: 'Category created with status ACTIVE' })
  @ApiConflictResponse({ description: 'Category name already exists' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List every category' })
  @ApiOkResponse({ description: 'List of categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one category' })
  @ApiOkResponse({ description: 'The category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiOkResponse({ description: 'Category updated' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiConflictResponse({ description: 'Category name already exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a category' })
  @ApiOkResponse({ description: 'Status updated' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryStatusDto: UpdateCategoryStatusDto,
  ) {
    return this.categoriesService.updateStatus(id, updateCategoryStatusDto);
  }
}
