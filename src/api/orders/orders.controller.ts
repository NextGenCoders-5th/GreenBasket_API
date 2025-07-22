import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CheckOutDto } from './dtos/checkout.dto';
import { ActiveUser, Role } from '../auth/decorators';
import { OrderStatus, UserRole } from '@prisma/client';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // findAllOrders
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Get all orders.',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  // findAllVendorOrders
  @ApiOperation({
    summary: 'Get all vendor orders',
    description: 'Get all orders for a specific vendor.',
  })
  @ApiParam({
    name: 'vendorId',
    description: 'The ID of the vendor to get orders for.',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Get('vendor/:vendorId')
  findAllVendorOrders(
    @Param('vendorId') vendorId: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.ordersService.findAllVendorOrders(vendorId, userId);
  }

  // findMyOrder
  @ApiOperation({
    summary: 'Get my order',
    description: 'Get a specific order for the authenticated user.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'The ID of the order to get.',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Get('my-orders/:orderId')
  findMyOrder(
    @Param('orderId') orderId: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.ordersService.findMyOrder(orderId, userId);
  }

  // findMyOrders
  @ApiOperation({
    summary: 'Get my orders',
    description: 'Get all orders for the authenticated user.',
  })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    required: false,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Get('my-orders')
  findMyOrders(
    @ActiveUser('sub') userId: string,
    @Query('status') status: OrderStatus,
  ) {
    return this.ordersService.findMyOrders(userId, status);
  }

  // findOrderById
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Get a specific order by its ID.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'The ID of the order to get.',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get(':orderId')
  findOrderById(@Param('orderId') orderId: string) {
    return this.ordersService.findOrderById(orderId);
  }

  // checkOut
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

  // updateOrderStatus
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update the status of an order.',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'Update the status of an order.',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN)
  @Patch(':orderId/status')
  updateStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @ActiveUser('role') role: UserRole,
  ) {
    return this.ordersService.updateOrderStatusById(
      orderId,
      updateOrderStatusDto,
      role,
    );
  }
}
