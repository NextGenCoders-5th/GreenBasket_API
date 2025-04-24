import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'The page number to retrieve',
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  limit?: number = 20;

  @ApiProperty({
    description: 'The number of items to skip',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
