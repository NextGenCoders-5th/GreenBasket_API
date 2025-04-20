import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cart, CartStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindMyCartProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findMyCart(userId: string) {
    let cart: Cart;

    try {
      cart = await this.prisma.cart.findUnique({
        where: { userId, status: CartStatus.ACTIVE },
        include: {
          CartItems: {
            include: {
              Product: true,
            },
          },
        },
      });
    } catch (err) {
      console.log('find-my-cart: ', err);
      throw new InternalServerErrorException(
        'Unable to find cart, please try again later.',
      );
    }

    if (!cart) {
      throw new NotFoundException('There is no active cart for this user');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Cart found successfully',
      data: cart,
    });
  }
}
