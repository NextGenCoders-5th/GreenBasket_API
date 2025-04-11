import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { VendorsModule } from '../vendors/vendors.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { CreateUserAddressProvider } from './providers/users/create-user-address.provider';
import { CreateVendorAddressProvider } from './providers/vendors/create-vendor-address.provider';
import { DeleteAddressProvider } from './providers/delete-address.provider';
import { FindAddressByIdProvider } from './providers/find-address-by-id.provider';
import { FindAllAddressesProvider } from './providers/find-all-addresses.provider';
import { FindOneAddressProvider } from './providers/find-one-address.provider';
import { UpdateAddressByIdProvider } from './providers/update-address-by-id.provider';
import { UpdateUserAddressProvider } from './providers/users/update-user-address.provider';
import { UpdateVendorAddressProvider } from './providers/vendors/update-vendor-address.provider';

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
    UpdateUserAddressProvider,
    UpdateVendorAddressProvider,
  ],
  imports: [PrismaModule, UsersModule, VendorsModule],
})
export class AddressesModule {}
