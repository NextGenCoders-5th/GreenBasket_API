import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { VendorsService } from 'src/api/vendors/vendors/vendors.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateAddressDto } from '../../dto/create-address.dto';

@Injectable()
export class CreateVendorAddressProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorsService: VendorsService,
  ) {}

  public async createVendorAddress(
    userId: string,
    createVendorAddressDto: CreateAddressDto,
  ) {
    const { city, country, street, sub_city, zip_code, latitude, longitude } =
      createVendorAddressDto;

    let address: Address | undefined;

    // check if user has a vendor and its existence
    const vendor = await this.vendorsService.findOneVendor({ userId });
    if (!vendor) {
      throw new NotFoundException('vendor for user not found.');
    }

    // create address and link that address to vendor
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
          vendorId: vendor.id,
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
      message: 'create vendor address successfull.',
      data: address,
    });
  }
}
