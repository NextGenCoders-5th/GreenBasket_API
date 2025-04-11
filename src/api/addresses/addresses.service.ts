import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { CreateVendorAddressDto } from './dto/create-vendor-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateUserAddressProvider } from './providers/create-user-address.provider';
import { CreateVendorAddressProvider } from './providers/create-vendor-address.provider';
import { DeleteAddressProvider } from './providers/delete-address.provider';
import { FindAddressByIdProvider } from './providers/find-address-by-id.provider';
import { FindAllAddressesProvider } from './providers/find-all-addresses.provider';
import { FindOneAddressProvider } from './providers/find-one-address.provider';

@Injectable()
export class AddressesService {
  constructor(
    private readonly findOneAddressProvider: FindOneAddressProvider,
    private readonly findAllAddressesProvider: FindAllAddressesProvider,
    private readonly findAddressByIdProvider: FindAddressByIdProvider,
    private readonly deleteAddressProvider: DeleteAddressProvider,
    private readonly createUserAddressProvider: CreateUserAddressProvider,
    private readonly createVendorAddressProvider: CreateVendorAddressProvider,
  ) {}

  createUserAddress(createUserAddressDto: CreateUserAddressDto) {
    return this.createUserAddressProvider.createUserAddress(
      createUserAddressDto,
    );
  }

  createVendorAddress(createVendorAddressDto: CreateVendorAddressDto) {
    return this.createVendorAddressProvider.createVendorAddress(
      createVendorAddressDto,
    );
  }

  findAllAddresses() {
    return this.findAllAddressesProvider.findAllAddresses();
  }

  findAddressById(id: string) {
    return this.findAddressByIdProvider.findAddressById(id);
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  deleteAddressById(id: string) {
    return this.deleteAddressProvider.deleteAddressById(id);
  }

  findOneAddress(option: Partial<Address>) {
    return this.findOneAddressProvider.findOneAdress(option);
  }
}
