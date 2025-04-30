import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllOrdersProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          Adress: true,
          OrderItems: true,
          User: true,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Orders fetched successfully',
        metadata: {},
        data: orders,
      });
    } catch (err) {
      console.log('find all orders error', err);
      throw new InternalServerErrorException(
        'Unable to fetch orders, please try again',
      );
    }
  }
}
