import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindVendorAddressesByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findVendorAdressesById(vendorId: string) {
    if (!vendorId) throw new BadRequestException('vendor id is required.');

    try {
      const addresses = await this.prisma.address.findMany({
        where: { vendorId },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'find vendor addresses by id successfull.',
        data: addresses,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable too find vendor addresses.',
      );
    }
  }
}
