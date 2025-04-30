import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CheckOutDto } from './dtos/checkout.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import {
  CheckOutProvider,
  FindAllOrdersProvider,
  FindAllVendorOrdersProvider,
  FindMyOrderProvider,
  FindMyOrdersProvider,
  FindOrderByIdProvider,
  UpdateOrderStatusByIdProvider,
} from './providers';

@Injectable()
export class OrdersService {
  constructor(
    private readonly checkOutProvider: CheckOutProvider,
    private readonly findAllOrdersProvider: FindAllOrdersProvider,
    private readonly findAllVendorOrdersProvider: FindAllVendorOrdersProvider,
    private readonly findMyOrderProvider: FindMyOrderProvider,
    private readonly findMyOrdersProvider: FindMyOrdersProvider,
    private readonly findOrderByIdProvider: FindOrderByIdProvider,
    private readonly updateOrderStatusByIdProvider: UpdateOrderStatusByIdProvider,
  ) {}

  findAllOrders() {
    return this.findAllOrdersProvider.findAllOrders();
  }

  findAllVendorOrders(vendorId: string, userId: string) {
    return this.findAllVendorOrdersProvider.findAllVendorOrders(
      vendorId,
      userId,
    );
  }

  findMyOrder(orderId: string, userId: string) {
    return this.findMyOrderProvider.findMyOrder(orderId, userId);
  }

  findMyOrders(userId: string) {
    return this.findMyOrdersProvider.findMyOrders(userId);
  }

  findOrderById(orderId: string) {
    return this.findOrderByIdProvider.findOrderById(orderId);
  }

  checkOut(checOutDto: CheckOutDto) {
    return this.checkOutProvider.checkOut(checOutDto);
  }

  updateOrderStatusById(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    role: UserRole,
  ) {
    return this.updateOrderStatusByIdProvider.updateOrderStatusById(
      orderId,
      updateOrderStatusDto,
      role,
    );
  }
}
