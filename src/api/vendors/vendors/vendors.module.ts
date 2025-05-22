import { Module } from '@nestjs/common';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CreateVendorProvider } from './providers/create-vendor.provider';
import { DeleteVendorProvider } from './providers/delete-vendor.provider';
import { FindAllVendorsProvider } from './providers/find-all-vendors.provider';
import { FindOneVendorProvider } from './providers/find-one-vendor.provider';
import { FindVendorByIdProvider } from './providers/find-vendor-by-id.provider';
import { UpdateVendorProvider } from './providers/update-vendor.provider';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { UsersModule } from '../../users/users.module';
import { VendorBalanceModule } from '../vendor_balance/vendor_balance.module';

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
  imports: [PrismaModule, FileUploadModule, UsersModule, VendorBalanceModule],
  exports: [VendorsService],
})
export class VendorsModule {}
