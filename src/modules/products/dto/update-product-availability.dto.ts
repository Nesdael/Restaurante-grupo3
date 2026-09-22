import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductAvailability } from '../enums/product-availability.enum.js';

export class UpdateProductAvailabilityDto {
  @ApiProperty({ enum: ProductAvailability })
  @IsEnum(ProductAvailability)
  @IsNotEmpty()
  availability: ProductAvailability;
}
