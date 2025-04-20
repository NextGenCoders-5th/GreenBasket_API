import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AddressesModule } from '../addresses/addresses.module';
import { CartModule } from '../cart/cart.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CheckOutProvider } from './providers/check-out.provider';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, CheckOutProvider],
  imports: [PrismaModule, CartModule, AddressesModule],
})
export class OrdersModule {}
