import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { Category } from './entities/category.entity.js';
import { CategoryStatus } from './enums/category-status.enum.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { UpdateCategoryStatusDto } from './dto/update-category-status.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    await this.ensureNameIsFree(createCategoryDto.name);
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  // Used by the public menu (HU-005): only ACTIVE categories are listed.
  findAllActive(): Promise<Category[]> {
    return this.categoriesRepository.findBy({ status: CategoryStatus.ACTIVE });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      await this.ensureNameIsFree(updateCategoryDto.name, id);
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async updateStatus(
    id: string,
    updateCategoryStatusDto: UpdateCategoryStatusDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    category.status = updateCategoryStatusDto.status;
    return this.categoriesRepository.save(category);
  }

  // RN-021: category name must be unique.
  private async ensureNameIsFree(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.categoriesRepository.findOneBy(
      excludeId ? { name, id: Not(excludeId) } : { name },
    );

    if (existing) {
      throw new ConflictException(`Category name "${name}" already exists`);
    }
  }
}
