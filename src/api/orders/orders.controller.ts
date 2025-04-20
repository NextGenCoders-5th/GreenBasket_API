import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CheckOutDto } from './dtos/checkout.dto';
import { ActiveUser, Role } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Check out',
    description: 'Check out the cart and create an order.',
  })
  @ApiBody({
    type: CheckOutDto,
    description: 'Check out the cart and create an order.',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Post('checkout')
  checkOut(
    @Body() checkOutDto: CheckOutDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.ordersService.checkOut({
      ...checkOutDto,
      userId,
    });
  }
}
