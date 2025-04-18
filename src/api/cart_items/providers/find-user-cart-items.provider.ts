import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindUserCartItemsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findUserCartItems(userId: string) {
    try {
      const cartItems = await this.prisma.cartItem.findMany({
        where: {
          Cart: {
            userId,
          },
        },
        include: {
          Product: true,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'find cart items successfull.',
        data: cartItems,
      });
    } catch (err) {
      console.log('findUserCartItems: ', err);
      throw new InternalServerErrorException(
        'Unable to find cart items. please try again later.',
      );
    }
  }
}
