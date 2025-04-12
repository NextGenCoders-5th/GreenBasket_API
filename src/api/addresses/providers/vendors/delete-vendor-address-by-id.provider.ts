import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VendorsService } from 'src/api/vendors/vendors.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneAddressProvider } from '../find-one-address.provider';
import { IDeleteVendorAddressById } from '../../interfaces/delete-vendor-address-by-id.interface';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class DeleteVendorAddressByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorsService: VendorsService,
    private readonly findOneAddressProvider: FindOneAddressProvider,
  ) {}

  public async deleteVendorAddressById(options: IDeleteVendorAddressById) {
    const { addressId, userId } = options;
    // check if vendor exists
    const vendor = await this.vendorsService.findOneVendor({ userId });
    if (!vendor) {
      throw new NotFoundException('vendor not found.');
    }

    // check if address exists
    const address = await this.findOneAddressProvider.findOneAdress({
      id: addressId,
    });
    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    // delete address
    try {
      await this.prisma.address.delete({ where: { id: addressId } });
    } catch (err) {
      console.log('delete-vendor-address-by-id', err);
      throw new InternalServerErrorException('Unable to find vendor address.');
    }

    // send response
    return CreateApiResponse({
      status: 'success',
      message: 'delete vendor address by id successfull.',
      data: null,
    });
  }
}
