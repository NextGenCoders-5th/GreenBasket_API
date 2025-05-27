import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import * as moment from 'moment';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  public async dashboardStats() {
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
        status: 'CONFIRMED', // optional filter
      },
      include: {
        OrderItems: true,
      },
    });

    // Initialize month stats
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = moment().month(i).format('MMM');
      return { month, orders: 0, sales: 0, revenue: 0 };
    });

    for (const order of orders) {
      const monthIndex = moment(order.createdAt).month();
      monthlyStats[monthIndex].orders += 1;

      for (const item of order.OrderItems) {
        monthlyStats[monthIndex].sales += item.quantity.toNumber();
        monthlyStats[monthIndex].revenue += Number(item.sub_total);
      }
    }

    return CreateApiResponse({
      status: 'success',
      message: 'dashboardStats successfull.',
      data: monthlyStats,
    });
  }
}
