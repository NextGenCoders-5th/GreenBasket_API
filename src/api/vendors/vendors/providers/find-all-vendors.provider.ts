import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Vendor } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllVendorsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllVendors() {
    let vendors: Vendor[] | undefined;

    try {
      vendors = await this.prisma.vendor.findMany();
    } catch (err) {
      console.log('find all vendors: ', err);
      throw new InternalServerErrorException(
        'Unable to find all vendors, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find all vendors successfull.',
      metadata: {},
      data: vendors,
    });
  }
}
