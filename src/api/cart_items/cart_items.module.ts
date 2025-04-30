import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { CartItemsController } from './cart_items.controller';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemProvider } from './providers/create-cart-item.provider';
import { DeleteCartItemByIdProvider } from './providers/delete-cart-item-by-id.provider';
import { FindAllCartItemsProvider } from './providers/find-all-cart-items.provider';
import { FindCartItemByIdProvider } from './providers/find-cart-item-by-id.provider';
import { FindOneCartItemProvider } from './providers/find-one-cart-item.provider';
import { UpdateCartItemByIdProvider } from './providers/update-cart-item-by-id.provider';
import { FindUserCartItemsProvider } from './providers/find-user-cart-items.provider';

@Module({
  controllers: [CartItemsController],
  providers: [
    CartItemsService,
    FindOneCartItemProvider,
    FindAllCartItemsProvider,
    FindCartItemByIdProvider,
    UpdateCartItemByIdProvider,
    DeleteCartItemByIdProvider,
    CreateCartItemProvider,
    FindUserCartItemsProvider,
  ],
  imports: [PrismaModule, ProductsModule, CartModule],
})
export class CartItemsModule {}
