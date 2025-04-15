import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { FindOneCartProvider } from './providers/find-one-cart.provider';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [CartController],
  providers: [CartService, FindOneCartProvider],
  imports: [PrismaModule],
})
export class CartModule {}
