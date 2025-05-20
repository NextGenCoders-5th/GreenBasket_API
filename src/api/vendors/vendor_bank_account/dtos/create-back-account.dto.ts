import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({
    description: 'bank account holder name',
  })
  @IsString()
  @IsNotEmpty()
  account_name: string;

  @ApiProperty({
    description: 'bank account number',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    description: 'bank name',
  })
  @IsString()
  @IsNotEmpty()
  bank_name: string;

  vendorId: string;
}
