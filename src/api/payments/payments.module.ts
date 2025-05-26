import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ChapaController } from './chapa/chapa.controller';
import { ChapaService } from './chapa/chapa.service';
import { InitializeOrderPaymentProvider } from './chapa/providers/initialize-order-payment.provider';
import { VerifyOrderPaymentProvider } from './chapa/providers/verify-order-payment.provider';
import { FindSupportedBankInfosProvider } from './chapa/providers/find-supported-bank-infos.provider';
import { VendorBalanceModule } from '../vendors/vendor_balance/vendor_balance.module';

@Module({
  controllers: [ChapaController],
  providers: [
    ChapaService,
    InitializeOrderPaymentProvider,
    VerifyOrderPaymentProvider,
    FindSupportedBankInfosProvider,
  ],
  imports: [PrismaModule, VendorBalanceModule],
})
export class PaymentsModule {}
