import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ChapaController } from './chapa/chapa.controller';
import { ChapaService } from './chapa/chapa.service';
import { InitializeOrderPaymentProvider } from './chapa/providers/initialize-order-payment.provider';
import { VerifyOrderPaymentProvider } from './chapa/providers/verify-order-payment.provider';
import { FindSupportedBankInfosProvider } from './chapa/providers/find-supported-bank-infos.provider';

@Module({
  controllers: [ChapaController],
  providers: [
    ChapaService,
    InitializeOrderPaymentProvider,
    VerifyOrderPaymentProvider,
    FindSupportedBankInfosProvider,
  ],
  imports: [PrismaModule],
})
export class PaymentsModule {}
