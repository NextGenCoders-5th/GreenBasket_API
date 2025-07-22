import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VendorsService } from 'src/api/vendors/vendors/vendors.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllVendorOrdersProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorsService: VendorsService,
  ) {}

  public async findAllVendorOrders(vendorId: string, userId: string) {
    const vendor = await this.vendorsService.findOneVendor({
      id: vendorId,
      userId,
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    try {
      const orders = await this.prisma.order.findMany({
        where: {
          OrderItems: {
            some: {
              Product: {
                vendorId,
              },
            },
          },
        },
        include: {
          Adress: true,
          OrderItems: {
            include: {
              Product: true,
            },
          },
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
      console.log('find all vendor orders error', err);
      throw new InternalServerErrorException(
        'Unable to fetch orders, please try again',
      );
    }
  }
}
