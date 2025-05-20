import { Module } from '@nestjs/common';
import { VendorBalanceController } from './vendor_balance.controller';
import { VendorBalanceService } from './vendor_balance.service';

@Module({
  controllers: [VendorBalanceController],
  providers: [VendorBalanceService]
})
export class VendorBalanceModule {}
