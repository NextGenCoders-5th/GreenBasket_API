import { Module } from '@nestjs/common';
import { VendorBankAccountController } from './vendor_bank_account.controller';
import { VendorBankAccountService } from './vendor_bank_account.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [PrismaModule, VendorsModule],
  controllers: [VendorBankAccountController],
  providers: [VendorBankAccountService],
})
export class VendorBankAccountModule {}
