import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { VendorsService } from 'src/api/vendors/vendors/vendors.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { UpdateVendorAddressDto } from '../../dto/vendors/update-vendor-address.dto';
import { FindOneAddressProvider } from '../find-one-address.provider';

@Injectable()
export class UpdateVendorAddressProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorsService: VendorsService,
    private readonly findOneAddressProvider: FindOneAddressProvider,
  ) {}
  public async updateVendorAddress(
    updateVendorAddressDto: UpdateVendorAddressDto,
  ) {
    const {
      city,
      country,
      latitude,
      longitude,
      street,
      sub_city,
      userId,
      zip_code,
      addressId,
    } = updateVendorAddressDto;
    let address: Address | undefined;

    // check if vendor exists
    const vendor = await this.vendorsService.findOneVendor({ userId });
    if (!vendor) {
      throw new NotFoundException('vendor not found to update the address');
    }

    // check if address exists
    address = await this.findOneAddressProvider.findOneAdress({
      id: addressId,
    });
    if (!address) {
      throw new NotFoundException('User address not found.');
    }

    // update address
    try {
      address = await this.prisma.address.update({
        where: { id: addressId },
        data: {
          city: city ?? address.city,
          country: country ?? address.country,
          latitude: latitude ?? address.latitude,
          longitude: longitude ?? address.longitude,
          street: street ?? address.street,
          sub_city: sub_city ?? address.sub_city,
          zip_code: zip_code ?? address.zip_code,
        },
      });
    } catch (err) {
      console.log('update user address', err);
      throw new InternalServerErrorException(
        'Unable to Create an address, please try again later.',
      );
    }

    // send the response
    return CreateApiResponse({
      status: 'success',
      message: 'update vendor address successfull.',
      data: address,
    });
  }
}
