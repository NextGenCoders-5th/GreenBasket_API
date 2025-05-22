import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  IsEnum,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export class GetProductsBaseDto {
  @ApiProperty({
    description: 'Search term for filtering products',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Minimum price',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Product status',
    enum: ProductStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({
    description: 'Vendor ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ApiProperty({
    description: 'Category ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'Featured products only',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Sort by field',
    required: false,
    enum: ['name', 'price', 'createdAt', 'stock'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'createdAt', 'stock'])
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class GetProductsDto extends IntersectionType(
  GetProductsBaseDto,
  PaginationQueryDto,
) {}
