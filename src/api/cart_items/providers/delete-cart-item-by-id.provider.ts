import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IDeleteCartItemById } from '../interfaces/delete-cart-item-by-id.interface';

@Injectable()
export class DeleteCartItemByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async deleteCartItemById(data: IDeleteCartItemById) {
    let cartItem: Prisma.CartItemGetPayload<{
      include: { Cart: true };
    }>;

    try {
      cartItem = await this.prisma.cartItem.findFirst({
        where: { id: data.cartItemId, Cart: { userId: data.userId } },
        include: {
          Cart: true,
        },
      });
    } catch (err) {
      console.log('deleteCartItemById: ', err);
      throw new InternalServerErrorException(
        'Unable to delete cart item. please try again later.',
      );
    }

    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    try {
      // delete cart item and update cart total
      await this.prisma.$transaction([
        this.prisma.cartItem.delete({
          where: { id: data.cartItemId, Cart: { userId: data.userId } },
        }),
        this.prisma.cart.update({
          where: { id: cartItem.cartId, userId: data.userId },
          data: {
            total_price: cartItem.Cart.total_price.sub(cartItem.sub_total),
          },
        }),
      ]);
    } catch (err) {
      console.log('deleteCartItemById: ', err);
      throw new InternalServerErrorException(
        'Unable to delete cart item. please try again later.',
      );
    }
  }
}
