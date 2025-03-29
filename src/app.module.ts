import { Module } from '@nestjs/common';
import { AddressesModule } from './api/addresses/addresses.module';
import { CategoriesModule } from './api/categories/categories.module';
import { OrderItemsModule } from './api/order_items/order_items.module';
import { OrdersModule } from './api/orders/orders.module';
import { PaymentsModule } from './api/payments/payments.module';
import { ProductsModule } from './api/products/products.module';
import { UsersModule } from './api/users/users.module';
import { VendorsModule } from './api/vendors/vendors.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    UsersModule,
    VendorsModule,
    AddressesModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    CategoriesModule,
    ProductsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
