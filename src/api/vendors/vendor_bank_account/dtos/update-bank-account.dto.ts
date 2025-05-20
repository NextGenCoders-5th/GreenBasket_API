import { PartialType } from '@nestjs/swagger';
import { CreateBankAccountDto } from './create-back-account.dto';

export class UpdateBankAccountDto extends PartialType(CreateBankAccountDto) {}
