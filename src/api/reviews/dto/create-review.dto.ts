import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Unique identifier for the order item being reviewed',
  })
  @IsNotEmpty()
  @IsUUID()
  orderItemId: string;

  @ApiProperty({
    description: 'Rating for the review, from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional comment for the review',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  comment?: string;

  userId: string;
}
