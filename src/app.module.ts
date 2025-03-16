import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { PaymentsModule } from './payments/payments.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
