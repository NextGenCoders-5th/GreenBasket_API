import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductUnitEnum } from '../enum/product-unit.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'product name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'product description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Price per unit (e.g., per kg, per piece).',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Optional discount price',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_price: number;

  @ApiProperty({
    description: 'Measurement unit',
    enum: ProductUnitEnum,
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'Product availability',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'product image',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      description: 'Category Ids',
      type: 'string',
    },
  })
  @Transform(({ value }) => {
    console.log({ value });
    if (!value) return []; // Ensure it's always an array
    if (Array.isArray(value)) return value; // Already an array, return as is
    if (
      typeof value === 'string' &&
      value.includes('[') &&
      value.includes(']')
    ) {
      value = String(value.slice(2, -2));
    }
    if (typeof value === 'string') {
      return value.includes(',')
        ? value.split(',').map((v) => v.trim())
        : [value];
    }

    return [];
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  // get it from the current login vendor
  userId: string;
  vendorId: string;
  image_url: string;
}
