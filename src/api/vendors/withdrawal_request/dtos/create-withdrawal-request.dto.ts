import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWithdrawalRequestDto {
  @ApiProperty({
    description: 'withdrawal amount.',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({
    description: 'some note about the withdrawal request.',
  })
  @IsOptional()
  @IsString()
  notes: string;

  userId: string;
}
