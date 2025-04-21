import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AddressesModule } from '../addresses/addresses.module';
import { CartModule } from '../cart/cart.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CheckOutProvider } from './providers/check-out.provider';
import { FindMyOrdersProvider } from './providers/find-my-orders.provider';
import { FindMyOrderProvider } from './providers/find-my-order.provider';
import { FindAllOrdersProvider } from './providers/find-all-orders.provider';
import { FindAllVendorOrdersProvider } from './providers/find-all-vendor-orders.provider';
import { FindOrderByIdProvider } from './providers/find-order-by-id.provider';
import { UpdateOrderStatusByIdProvider } from './providers/update-order-status-by-id.provider';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CheckOutProvider,
    FindMyOrdersProvider,
    FindMyOrderProvider,
    FindAllOrdersProvider,
    FindAllVendorOrdersProvider,
    FindOrderByIdProvider,
    UpdateOrderStatusByIdProvider,
  ],
  imports: [PrismaModule, CartModule, AddressesModule],
})
export class OrdersModule {}
