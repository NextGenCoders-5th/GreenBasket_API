import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindMyOrderProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findMyOrder(orderId: string, userId: string) {
    let order: any;
    try {
      order = await this.prisma.order.findFirst({
        where: {
          id: orderId,
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
    } catch (err) {
      console.log('find my order error', err);
      throw new InternalServerErrorException(
        'Unable to fetch order, please try again',
      );
    }

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Order fetched successfully',
      data: order,
    });
  }
}
