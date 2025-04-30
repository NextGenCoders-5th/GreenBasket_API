import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'The status of the order',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
