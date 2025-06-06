import { Injectable } from '@nestjs/common';
import { Cart, CartStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneCartProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneCart(options: Partial<Cart>) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          ...options,
          status: CartStatus.ACTIVE,
        },
      });

      return cart;
    } catch (err) {
      console.log('FindOneCartProvider: ', err);
    }
  }
}
