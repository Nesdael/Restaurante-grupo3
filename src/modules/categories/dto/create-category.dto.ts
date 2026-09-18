import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// RN-022: status is not accepted here. A new category always starts as ACTIVE.
export class CreateCategoryDto {
  @ApiProperty({ example: 'Drinks', maxLength: 60 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({ example: 'Soft drinks and juices', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
