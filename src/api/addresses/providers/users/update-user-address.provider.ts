import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneAddressProvider } from '../find-one-address.provider';
import { UpdateUserAddressDto } from '../../dto/users/update-user-address.dto';
import { Address } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateUserAddressProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneAddressProvider: FindOneAddressProvider,
  ) {}

  public async updateUserAddress(updateUserAddressDto: UpdateUserAddressDto) {
    const {
      city,
      country,
      latitude,
      longitude,
      street,
      sub_city,
      userId,
      zip_code,
    } = updateUserAddressDto;

    let address: Address | undefined;
    // check if address exists
    address = await this.findOneAddressProvider.findOneAdress({ userId });
    if (!address) {
      throw new NotFoundException('User address not found.');
    }
    // update address
    try {
      address = await this.prisma.address.update({
        where: { id: address.id, userId },
        data: {
          city: city ?? address.city,
          country: country ?? address.country,
          latitude: latitude ?? address.latitude,
          longitude: longitude ?? address.longitude,
          street: street ?? address.street,
          sub_city: sub_city ?? address.sub_city,
          zip_code: zip_code ?? address.zip_code,
          userId: address.userId,
        },
      });
    } catch (err) {
      console.log('update user address', err);
      throw new InternalServerErrorException(
        'Unable to Create an address, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'user address updated successfully.',
      data: address,
    });
  }
}
