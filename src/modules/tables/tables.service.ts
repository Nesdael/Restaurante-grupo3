import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
import { UpdateTableStatusDto } from './dto/update-table-status.dto.js';
import { FilterTablesDto } from './dto/filter-tables.dto.js';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tablesRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    await this.ensureNumberIsFree(createTableDto.number);
    const table = this.tablesRepository.create(createTableDto);
    return this.tablesRepository.save(table);
  }

  // TypeORM rejects undefined values in `where`, so only the filters actually
  // sent (status, zone, capacity) are forwarded.
  findAll(filters: FilterTablesDto): Promise<Table[]> {
    const where = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    );
    return this.tablesRepository.findBy(where);
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.tablesRepository.findOneBy({ id });
    if (!table) {
      throw new NotFoundException(`Table ${id} not found`);
    }
    return table;
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.findOne(id);
    if (updateTableDto.number && updateTableDto.number !== table.number) {
      await this.ensureNumberIsFree(updateTableDto.number);
    }
    Object.assign(table, updateTableDto);
    return this.tablesRepository.save(table);
  }

  async updateStatus(
    id: string,
    updateTableStatusDto: UpdateTableStatusDto,
  ): Promise<Table> {
    const table = await this.findOne(id);
    table.status = updateTableStatusDto.status;
    return this.tablesRepository.save(table);
  }

  // RN-016: table number must be unique.
  private async ensureNumberIsFree(number: number): Promise<void> {
    const existing = await this.tablesRepository.findOneBy({ number });
    if (existing) {
      throw new ConflictException(`Table number ${number} already exists`);
    }
  }
}
