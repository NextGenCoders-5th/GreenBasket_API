import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllCartItemsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllCartItems() {
    try {
      const cartItems = await this.prisma.cartItem.findMany({
        include: {
          Cart: true,
          Product: true,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'find all cart items successfully.',
        data: cartItems,
      });
    } catch (err) {
      console.log('findAllCartItems: ', err);
      throw new InternalServerErrorException(
        'Unable to find cart items. please try again later.',
      );
    }
  }
}
