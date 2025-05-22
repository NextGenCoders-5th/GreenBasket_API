import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDataDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {}
