import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindProductsByVendorProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findProductsByVendor(vendorId: string) {
    try {
      const data = await this.prisma.product.findMany({
        where: { vendorId },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'find products by category successfull.',
        data,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unabble to find products by category id.',
      );
    }
  }
}
