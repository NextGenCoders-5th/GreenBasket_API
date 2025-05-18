import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChapaModule } from 'chapa-nestjs';
import { AddressesModule } from './api/addresses/addresses.module';
import { AuthModule } from './api/auth/auth.module';
import { CartModule } from './api/cart/cart.module';
import { CartItemsModule } from './api/cart_items/cart_items.module';
import { CategoriesModule } from './api/categories/categories.module';
import { OrderItemsModule } from './api/order_items/order_items.module';
import { OrdersModule } from './api/orders/orders.module';
import { PaymentsModule } from './api/payments/payments.module';
import { ProductsModule } from './api/products/products.module';
import { UsersModule } from './api/users/users.module';
import { VendorsModule } from './api/vendors/vendors.module';
import { ConfigurationModule } from './common/configuration/configuration.module';
import { FileUploadModule } from './common/file-upload/file-upload.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { PinnoLoggerModule } from './common/pinno-logger/pinno-logger.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { SwaggerConfigModule } from './common/swagger/swagger.module';
import { ReviewsModule } from './api/reviews/reviews.module';
import { AppController } from './app.controller';
import { EmailModule } from './common/email/email.module';
import { MessageModule } from './common/message/message.module';

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
    SwaggerConfigModule,
    PinnoLoggerModule,
    InterceptorsModule,
    ConfigurationModule,
    CartModule,
    CartItemsModule,
    AuthModule,
    FileUploadModule,

    ChapaModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretKey: configService.get('paymentConfig.chapaSecretKey'),
      }),
    }),

    ReviewsModule,

    EmailModule,

    MessageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
