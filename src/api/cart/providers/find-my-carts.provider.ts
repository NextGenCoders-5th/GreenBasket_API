import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindMyCartsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findMyCarts(userId: string) {
    try {
      const carts = await this.prisma.cart.findMany({
        where: { userId },
        include: {
          CartItems: true,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Carts found successfully',
        data: carts,
      });
    } catch (err) {
      console.log('find-my-carts: ', err);
      throw new InternalServerErrorException(
        'Unable to find carts, please try again later.',
      );
    }
  }
}
