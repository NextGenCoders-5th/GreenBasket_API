import { ApiProperty } from '@nestjs/swagger';
import { WithdrawalStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ProcessWithdrawalDto {
  @ApiProperty({
    description: 'withdrawal status.',
    enum: WithdrawalStatus,
  })
  @IsEnum(WithdrawalStatus)
  @IsNotEmpty()
  status: WithdrawalStatus;
}
