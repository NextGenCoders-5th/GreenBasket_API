import { Module } from '@nestjs/common';
import { CreateVendorProvider } from './providers/create-vendor.provider';
import { DeleteVendorProvider } from './providers/delete-vendor.provider';
import { FindAllVendorsProvider } from './providers/find-all-vendors.provider';
import { FindOneVendorProvider } from './providers/find-one-vendor.provider';
import { FindVendorByIdProvider } from './providers/find-vendor-by-id.provider';
import { UpdateVendorProvider } from './providers/update-vendor.provider';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

@Module({
  controllers: [VendorsController],
  providers: [
    VendorsService,
    UpdateVendorProvider,
    CreateVendorProvider,
    DeleteVendorProvider,
    FindAllVendorsProvider,
    FindOneVendorProvider,
    FindVendorByIdProvider,
  ],
})
export class VendorsModule {}
