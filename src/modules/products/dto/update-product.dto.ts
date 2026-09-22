import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto.js';

// status and availability are not editable here: they have their own
// endpoints (PATCH /products/:id/status and /products/:id/availability).
export class UpdateProductDto extends PartialType(CreateProductDto) {}
