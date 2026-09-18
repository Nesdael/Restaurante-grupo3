import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  number: number;

  // RN-017: capacity must be greater than zero.
  @ApiProperty({ example: 4 })
  @IsInt()
  @IsPositive()
  capacity: number;

  @ApiProperty({ example: 'Terrace' })
  @IsString()
  @IsNotEmpty()
  zone: string;
}
