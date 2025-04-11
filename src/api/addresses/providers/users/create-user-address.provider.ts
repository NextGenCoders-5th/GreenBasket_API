import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateUserAddressDto } from '../../dto/users/create-user-address.dto';
import { FindOneAddressProvider } from '../find-one-address.provider';

@Injectable()
export class CreateUserAddressProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneAddressProvider: FindOneAddressProvider,
  ) {}

  public async createUserAddress(createUserAddressDto: CreateUserAddressDto) {
    const {
      city,
      country,
      street,
      sub_city,
      zip_code,
      latitude,
      longitude,
      userId,
    } = createUserAddressDto;

    let address: Address | undefined;

    address = await this.findOneAddressProvider.findOneAdress({ userId });

    if (address) {
      throw new BadRequestException(
        'User has created address already. you can update it.',
      );
    }

    // create address and link that address to user
    try {
      address = await this.prisma.address.create({
        data: {
          city,
          country,
          latitude,
          longitude,
          street,
          zip_code,
          sub_city,
          userId,
        },
      });
    } catch (err) {
      console.log('CreateUserAddressProvider: ', err);
      throw new InternalServerErrorException(
        'Unable to create user address, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'create user address successfull.',
      data: address,
    });
  }
}
