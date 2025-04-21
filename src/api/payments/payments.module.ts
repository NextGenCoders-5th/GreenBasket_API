import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ChapaController } from './chapa/chapa.controller';
import { ChapaService } from './chapa/chapa.service';
import { InitializeOrderPaymentProvider } from './chapa/providers/initialize-order-payment.provider';
import { VerifyOrderPaymentProvider } from './chapa/providers/verify-order-payment.provider';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [PaymentsController, ChapaController],
  providers: [
    PaymentsService,
    ChapaService,
    InitializeOrderPaymentProvider,
    VerifyOrderPaymentProvider,
  ],
  imports: [PrismaModule],
})
export class PaymentsModule {}
