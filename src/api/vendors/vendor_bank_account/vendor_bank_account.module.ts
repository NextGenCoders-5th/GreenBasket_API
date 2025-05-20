import { Module } from '@nestjs/common';
import { VendorBankAccountController } from './vendor_bank_account.controller';
import { VendorBankAccountService } from './vendor_bank_account.service';

@Module({
  controllers: [VendorBankAccountController],
  providers: [VendorBankAccountService]
})
export class VendorBankAccountModule {}
