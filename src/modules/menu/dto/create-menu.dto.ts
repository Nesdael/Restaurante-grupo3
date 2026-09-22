import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuAvailability } from '../enum/menu-status.enum.ts.js';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Category ID to which the product belongs',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Pizza Margherita',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Classic tomato and cheese',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Product price', example: 12.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    enum: MenuAvailability,
    default: MenuAvailability.AVAILABLE,
    description: 'Availability status of the product',
  })
  @IsEnum(MenuAvailability)
  @IsOptional()
  availability?: MenuAvailability;
}
