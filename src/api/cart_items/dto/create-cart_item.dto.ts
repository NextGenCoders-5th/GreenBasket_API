import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'price per unit',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'quantity of the cart item',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'product id',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  userId: string;
}
