import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { CreateUserAddressProvider } from './providers/create-user-address.provider';
import { CreateVendorAddressProvider } from './providers/create-vendor-address.provider';
import { DeleteAddressProvider } from './providers/delete-address.provider';
import { FindAddressByIdProvider } from './providers/find-address-by-id.provider';
import { FindAllAddressesProvider } from './providers/find-all-addresses.provider';
import { FindOneAddressProvider } from './providers/find-one-address.provider';
import { UpdateAddressByIdProvider } from './providers/update-address-by-id.provider';

@Module({
  controllers: [AddressesController],
  providers: [
    AddressesService,
    FindAddressByIdProvider,
    FindAllAddressesProvider,
    FindOneAddressProvider,
    CreateUserAddressProvider,
    CreateVendorAddressProvider,
    DeleteAddressProvider,
    UpdateAddressByIdProvider,
  ],
})
export class AddressesModule {}
