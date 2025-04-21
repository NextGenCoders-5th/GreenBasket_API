import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class InitializeOrderPaymentDto {
  @ApiProperty({ description: 'Order ID to pay for' })
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  userId: string;
}
