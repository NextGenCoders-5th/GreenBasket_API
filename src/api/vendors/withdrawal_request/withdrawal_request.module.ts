import { Module } from '@nestjs/common';
import { WithdrawalRequestController } from './withdrawal_request.controller';
import { WithdrawalRequestService } from './withdrawal_request.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WithdrawalRequestController],
  providers: [WithdrawalRequestService],
})
export class WithdrawalRequestModule {}
