import { Module } from '@nestjs/common';
import { WithdrawalRequestController } from './withdrawal_request.controller';
import { WithdrawalRequestService } from './withdrawal_request.service';

@Module({
  controllers: [WithdrawalRequestController],
  providers: [WithdrawalRequestService]
})
export class WithdrawalRequestModule {}
