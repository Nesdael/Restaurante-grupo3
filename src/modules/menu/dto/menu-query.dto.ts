import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { ProductAvailability } from '../../products/enums/product-availability.enum.js';

// Optional filter: ?availability=AVAILABLE returns only the products
// that can be ordered right now.
export class MenuQueryDto {
  @ApiPropertyOptional({ enum: ProductAvailability })
  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;
}
