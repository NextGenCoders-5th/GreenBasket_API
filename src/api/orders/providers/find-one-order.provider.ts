import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneOrderProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneOrder(options: Partial<Order>) {
    try {
      const order = await this.prisma.order.findFirst({
        where: options,
      });

      return order;
    } catch (err) {
      console.log('findOneOrderProvider error', err);
      throw new InternalServerErrorException(
        'Unable to find one order, please try again later',
      );
    }
  }
}
