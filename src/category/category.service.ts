import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (categoryExists) {
      throw new ConflictException(
        'Ya existe una categoría con ese nombre',
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const categoryExists = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name,
        },
      });

      if (categoryExists && categoryExists.id !== id) {
        throw new ConflictException(
          'Ya existe una categoría con ese nombre',
        );
      }
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async updateStatus(
    id: string,
    status: UpdateCategoryDto['status'],
  ) {
    const category = await this.findOne(id);

    if (status !== undefined) {
      category.status = status;
    }

    return await this.categoryRepository.save(category);
  }
}