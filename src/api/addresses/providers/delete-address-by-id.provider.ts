import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { FindOneAddressProvider } from './find-one-address.provider';

@Injectable()
export class DeleteAddressByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneAddressProvider: FindOneAddressProvider,
  ) {}

  public async deleteAddressById(id: string) {
    const address = await this.findOneAddressProvider.findOneAdress({ id });
    if (!address) {
      throw new BadRequestException('Address not found when deleting.');
    }

    try {
      await this.prisma.address.delete({ where: { id } });
    } catch (err) {
      console.log('delete address by id provider', err);
      throw new InternalServerErrorException(
        'Unable to delete address by id, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'delete address by id successfull',
      data: null,
    });
  }
}
