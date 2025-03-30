import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';

@Module({
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
