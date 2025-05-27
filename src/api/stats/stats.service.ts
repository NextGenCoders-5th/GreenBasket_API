import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import * as moment from 'moment';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  public async dashboardStats(vendorId: string) {
    try {
      const startOfYear = moment().startOf('year').toDate();
      const endOfYear = moment().endOf('year').toDate();

      const orders = await this.prisma.order.findMany({
        where: {
          vendorId,
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
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Unable to get dashboard stats.');
    }
  }

  public async vendorStats(vendorId: string) {
    try {
      const result = await this.prisma.product.groupBy({
        by: ['vendorId'],
        _count: {
          id: true,
        },
      });

      const groupedProducts = result.map((item) => ({
        vendorId: item.vendorId,
        totalProducts: item._count.id,
      }));

      const groupedReviewsRaw = await this.prisma.$queryRaw<
        { vendorId: string; totalReviews: bigint; averageRating: number }[]
      >`
  SELECT 
    p."vendorId", 
    COUNT(r.id) AS "totalReviews",
    AVG(r."rating")::FLOAT AS "averageRating"
  FROM "Review" r
  INNER JOIN "OrderItem" oi ON r."orderItemId" = oi.id
  INNER JOIN "Product" p ON oi."productId" = p.id
  GROUP BY p."vendorId"
`;

      // convert BigInt to number
      const groupedReviews = groupedReviewsRaw.map((item) => ({
        vendorId: item.vendorId,
        totalReviews: Number(item.totalReviews), // convert BigInt -> Number
        averageRating: item.averageRating,
      }));
      const data = await this.prisma.vendor.findMany({
        include: {
          address: true,
        },
      });

      const formatedData = data.map((vendor) => {
        const product = groupedProducts.find((p) => p.vendorId === vendor.id);
        const reveiw = groupedReviews.find((r) => r.vendorId === vendor.id);
        return {
          ...vendor,
          totalProducts: product?.totalProducts || 0,
          totalReviews: reveiw?.totalReviews || 0,
          averageRating: reveiw?.averageRating || 0,
        };
      });

      return CreateApiResponse({
        status: 'success',
        message: 'stats successfull.',
        data: formatedData,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Unable to get vendor stats.');
    }
  }
}
