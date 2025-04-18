import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { IFindCartItemById } from '../interfaces/find-cart-by-id.interface';

@Injectable()
export class FindCartItemByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findCartItemById(data: IFindCartItemById) {
    let cartItem: CartItem | undefined;
    try {
      cartItem = await this.prisma.cartItem.findFirst({
        where: { id: data.cartItemId, Cart: { userId: data.userId } },
        include: {
          Cart: true,
          Product: true,
        },
      });
    } catch (err) {
      console.log('findCartItemById: ', err);
      throw new InternalServerErrorException(
        'Unable to find cart item. please try again later.',
      );
    }

    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find cart item successfull.',
      data: cartItem,
    });
  }
}
