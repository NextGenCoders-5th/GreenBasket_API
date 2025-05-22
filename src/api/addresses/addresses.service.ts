import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { CreateUserAddressDto } from './dto/users/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/users/update-user-address.dto';
import { CreateVendorAddressDto } from './dto/vendors/create-vendor-address.dto';
import { UpdateVendorAddressDto } from './dto/vendors/update-vendor-address.dto';
import { IDeleteVendorAddressById } from './interfaces/delete-vendor-address-by-id.interface';
import { DeleteAddressByIdProvider } from './providers/delete-address-by-id.provider';
import { FindAddressByIdProvider } from './providers/find-address-by-id.provider';
import { FindAllAddressesProvider } from './providers/find-all-addresses.provider';
import { FindOneAddressProvider } from './providers/find-one-address.provider';
import { CreateUserAddressProvider } from './providers/users/create-user-address.provider';
import { UpdateUserAddressProvider } from './providers/users/update-user-address.provider';
import { CreateVendorAddressProvider } from './providers/vendors/create-vendor-address.provider';
import { DeleteVendorAddressByIdProvider } from './providers/vendors/delete-vendor-address-by-id.provider';
import { UpdateVendorAddressProvider } from './providers/vendors/update-vendor-address.provider';
import { FindUserAddressByIdProvider } from './providers/users/find-user-address-by-id.provider';

@Injectable()
export class AddressesService {
  constructor(
    private readonly findOneAddressProvider: FindOneAddressProvider,
    private readonly findAllAddressesProvider: FindAllAddressesProvider,
    private readonly findAddressByIdProvider: FindAddressByIdProvider,
    private readonly deleteAddressByIdProvider: DeleteAddressByIdProvider,
    private readonly createUserAddressProvider: CreateUserAddressProvider,
    private readonly createVendorAddressProvider: CreateVendorAddressProvider,
    private readonly updateUserAddressProvider: UpdateUserAddressProvider,
    private readonly updateVendorAddressProvider: UpdateVendorAddressProvider,
    private readonly deleteVendorAddressByIdProvider: DeleteVendorAddressByIdProvider,
    private readonly findUserAddressByIdProvider: FindUserAddressByIdProvider,
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

  updateUserAddress(updateUserAddressDto: UpdateUserAddressDto) {
    return this.updateUserAddressProvider.updateUserAddress(
      updateUserAddressDto,
    );
  }

  findUserAdressById(userId: string) {
    return this.findUserAddressByIdProvider.findUserAdressById(userId);
  }

  updateVendorAddress(updateVendorAddressDto: UpdateVendorAddressDto) {
    return this.updateVendorAddressProvider.updateVendorAddress(
      updateVendorAddressDto,
    );
  }

  deleteVendorAddressById(options: IDeleteVendorAddressById) {
    return this.deleteVendorAddressByIdProvider.deleteVendorAddressById(
      options,
    );
  }

  deleteAddressById(id: string) {
    return this.deleteAddressByIdProvider.deleteAddressById(id);
  }

  findOneAddress(option: Partial<Address>) {
    return this.findOneAddressProvider.findOneAdress(option);
  }
}
