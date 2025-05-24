import { PartialType, OmitType, IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { CompleteOnboardingDto } from './complete-onboarding.dto';

export class UpdateUserDataDto extends IntersectionType(
  PartialType(OmitType(CreateUserDto, ['role'] as const)),
  PartialType(
    OmitType(CompleteOnboardingDto, [
      'userId',
      'first_name',
      'last_name',
      'idPhoto_back',
      'idPhoto_front',
    ] as const),
  ),
) {}
