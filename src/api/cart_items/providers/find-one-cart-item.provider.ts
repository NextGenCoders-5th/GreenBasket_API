import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneCartItemProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneCartItem(options: Partial<CartItem>) {
    try {
      const cartItem = await this.prisma.cartItem.findFirst({ where: options });
      return cartItem;
    } catch (err) {
      console.log('findOneCartItem: ', err);
      throw new InternalServerErrorException(
        'Unable to find one cart item. please try again later.',
      );
    }
  }
}
