import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Vendor } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneVendorProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneVendor(options: Partial<Vendor>) {
    try {
      const vendor = await this.prisma.vendor.findFirst({
        where: options,
      });
      return vendor;
    } catch (err) {
      console.log('find one user by options: ', err);
      throw new InternalServerErrorException(
        'Unable to find user, Please try again later.',
      );
    }
  }
}
