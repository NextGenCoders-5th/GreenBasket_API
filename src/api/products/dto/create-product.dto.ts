import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount_price: number;

  @ApiProperty({
    description: 'Measurement unit (e.g., kg, lb, bunch).',
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
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  // get it from the current login vendor
  vendorId: string;
  image_url: string;
}
