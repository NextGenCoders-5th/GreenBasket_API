import { Module } from '@nestjs/common';
import { VenderTransactionModule } from './vender_transaction/vender_transaction.module';
import { VendorBalanceModule } from './vendor_balance/vendor_balance.module';
import { VendorBankAccountModule } from './vendor_bank_account/vendor_bank_account.module';
import { VendorsModule } from './vendors/vendors.module';
import { WithdrawalRequestModule } from './withdrawal_request/withdrawal_request.module';

@Module({
  imports: [
    VendorBankAccountModule,
    VendorBalanceModule,
    VenderTransactionModule,
    WithdrawalRequestModule,
    VendorsModule,
  ],
})
export class VendorsRootModule {}
