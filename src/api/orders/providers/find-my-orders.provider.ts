import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindMyOrdersProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findMyOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          Adress: true,
          OrderItems: {
            include: {
              Product: true,
            },
          },
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Orders fetched successfully',
        data: orders,
      });
    } catch (err) {
      console.log('find my orders error', err);
      throw new InternalServerErrorException(
        'Unable to fetch orders, please try again',
      );
    }
  }
}
