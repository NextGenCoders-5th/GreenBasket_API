import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindMyCartProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async findMyCart(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          CartItems: {
            include: {
              Product: true,
            },
          },
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Cart found successfully',
        data: cart,
      });
    } catch (err) {
      console.log('find-my-cart: ', err);
      throw new InternalServerErrorException(
        'Unable to find cart, please try again later.',
      );
    }
  }
}
