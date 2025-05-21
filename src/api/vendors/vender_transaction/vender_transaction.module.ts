import { Module } from '@nestjs/common';
import { VenderTransactionController } from './vender_transaction.controller';
import { VenderTransactionService } from './vender_transaction.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VenderTransactionController],
  providers: [VenderTransactionService],
})
export class VenderTransactionModule {}
