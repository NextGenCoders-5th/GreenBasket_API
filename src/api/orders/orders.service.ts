import { Injectable } from '@nestjs/common';
import { CheckOutDto } from './dtos/checkout.dto';
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

  checkOut(checOutDto: CheckOutDto) {
    return this.checkOutProvider.checkOut(checOutDto);
  }
}
