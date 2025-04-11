import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAddressByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAddressById(id: string) {
    let address: Address | undefined;

    try {
      address = await this.prisma.address.findFirst({ where: { id } });
    } catch (err) {
      console.log('find address by id provider: ', err);
      throw new InternalServerErrorException(
        'Unable to find address by id, please try again later.',
      );
    }

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find address by id successfull.',
      data: address,
    });
  }
}
