import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { FindOneCartProvider } from './providers/find-one-cart.provider';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CreateCartProvider } from './providers/create-cart.provider';
import { FindMyCartProvider } from './providers/find-my-cart.provider';

@Module({
  controllers: [CartController],
  providers: [CartService, FindOneCartProvider, CreateCartProvider, FindMyCartProvider],
  imports: [PrismaModule],
  exports: [CartService],
})
export class CartModule {}
