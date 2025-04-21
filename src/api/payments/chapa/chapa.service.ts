import { Injectable } from '@nestjs/common';
import { InitializeOrderPaymentProvider } from './providers/initialize-order-payment.provider';
import { VerifyOrderPaymentProvider } from './providers/verify-order-payment.provider';
import { InitializeOrderPaymentDto } from './dtos/initialize-order-payment.dto';
import { VerifyOrderPaymentDto } from './dtos/verify-order-payment.dto';

@Injectable()
export class ChapaService {
  constructor(
    private readonly initializeOrderPaymentProvider: InitializeOrderPaymentProvider,
    private readonly verifyOrderPaymentProvider: VerifyOrderPaymentProvider,
  ) {}

  initializeOrderPayment(initializeOrderPaymentDto: InitializeOrderPaymentDto) {
    return this.initializeOrderPaymentProvider.initializeOrderPayment(
      initializeOrderPaymentDto,
    );
  }

  verifyOrderPayment(verifyOrderPaymentDto: VerifyOrderPaymentDto) {
    return this.verifyOrderPaymentProvider.verifyOrderPayment(
      verifyOrderPaymentDto,
    );
  }
}
