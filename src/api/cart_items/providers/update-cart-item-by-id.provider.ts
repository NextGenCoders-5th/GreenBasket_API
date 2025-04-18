import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCartItemDto } from '../dto/update-cart_item.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CartItem } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateCartItemByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async updateCartItemById(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity, userId } = updateCartItemDto;

    let cartItem: CartItem;
    try {
      cartItem = await this.prisma.cartItem.findFirst({
        where: { id, Cart: { userId } },
      });
    } catch (err) {
      console.log('UpdateCartItemByIdProvider: ', err);
      throw new InternalServerErrorException(
        'Unable to find cart item. please try again later.',
      );
    }
    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    let updatedCartItem: CartItem;
    try {
      await this.prisma.$transaction(async (prisma) => {
        updatedCartItem = await prisma.cartItem.update({
          where: { id },
          data: {
            quantity,
            sub_total: cartItem.price.mul(quantity),
          },
          include: {
            Product: true,
          },
        });

        const subTotalAfterUpdate = cartItem.price.mul(quantity).toNumber();

        await prisma.cart.update({
          where: { id: cartItem.cartId, userId },
          data: {
            total_price: {
              increment: subTotalAfterUpdate - cartItem.sub_total.toNumber(),
            },
          },
        });
      });
    } catch (err) {
      console.log('UpdateCartItemByIdProvider: ', err);
      throw new InternalServerErrorException(
        'Unable to update cart item. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Cart item updated successfully.',
      data: updatedCartItem,
    });
  }
}
