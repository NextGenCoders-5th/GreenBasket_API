import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'quantity of the cart item',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'quantity must be greater than 0' })
  quantity: number;

  @ApiProperty({
    description: 'product id',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  userId: string;
}
