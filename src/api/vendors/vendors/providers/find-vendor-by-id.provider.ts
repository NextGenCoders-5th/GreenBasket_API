import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Vendor } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindVendorByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findVendorById(id: string) {
    let vendor: Vendor | undefined;

    try {
      vendor = await this.prisma.vendor.findFirst({ where: { id } });
    } catch (err) {
      console.log('find vendor by id', err);
      throw new InternalServerErrorException(
        'Unable to fetch vendor from the database, please try again later.',
      );
    }
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find vendor by id successfull.',
      data: vendor,
    });
  }
}
