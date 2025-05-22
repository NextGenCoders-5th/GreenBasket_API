import { Module } from '@nestjs/common';
import { VendorBalanceController } from './vendor_balance.controller';
import { VendorBalanceService } from './vendor_balance.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VendorBalanceController],
  providers: [VendorBalanceService],
  exports: [VendorBalanceService],
})
export class VendorBalanceModule {}
