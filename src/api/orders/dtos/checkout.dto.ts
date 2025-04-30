import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CheckOutDto {
  @ApiProperty({
    description: 'The ID of the cart to check out',
  })
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @ApiProperty({
    description: 'The ID of the address to ship to',
  })
  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  userId: string;
  // TODO: add more properties as later
  // couponCode?: string;
  // note?: string;
}
