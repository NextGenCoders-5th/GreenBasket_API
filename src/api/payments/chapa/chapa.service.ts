import { Injectable } from '@nestjs/common';
import { InitializeOrderPaymentDto } from './dtos/initialize-order-payment.dto';
import { FindSupportedBankInfosProvider } from './providers/find-supported-bank-infos.provider';
import { InitializeOrderPaymentProvider } from './providers/initialize-order-payment.provider';
import { VerifyOrderPaymentProvider } from './providers/verify-order-payment.provider';

@Injectable()
export class ChapaService {
  constructor(
    private readonly initializeOrderPaymentProvider: InitializeOrderPaymentProvider,
    private readonly verifyOrderPaymentProvider: VerifyOrderPaymentProvider,
    private readonly findSupportedBankInfosProvider: FindSupportedBankInfosProvider,
  ) {}

  initializeOrderPayment(initializeOrderPaymentDto: InitializeOrderPaymentDto) {
    return this.initializeOrderPaymentProvider.initializeOrderPayment(
      initializeOrderPaymentDto,
    );
  }

  verifyOrderPayment(tx_ref: string) {
    console.log('service verify payment...');
    return this.verifyOrderPaymentProvider.verifyOrderPayment(tx_ref);
  }

  findSupportedBankInfos() {
    return this.findSupportedBankInfosProvider.findSupportedBankInfos();
  }
}
