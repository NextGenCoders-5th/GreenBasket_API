import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllAddressesProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllAddresses() {
    let addresses: Address[] | undefined;
    try {
      addresses = await this.prisma.address.findMany();
    } catch (err) {
      console.log('find all addresses', err);
      throw new InternalServerErrorException(
        'Unable to fetch addresses, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find all addresses successfull',
      metadata: {},
      data: addresses,
    });
  }
}
