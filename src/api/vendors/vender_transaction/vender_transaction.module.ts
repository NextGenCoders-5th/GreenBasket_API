import { Module } from '@nestjs/common';
import { VenderTransactionController } from './vender_transaction.controller';
import { VenderTransactionService } from './vender_transaction.service';

@Module({
  controllers: [VenderTransactionController],
  providers: [VenderTransactionService]
})
export class VenderTransactionModule {}
