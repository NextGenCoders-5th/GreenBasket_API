import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/auth.constant';
import { AuthType } from '../enums/auth-type.enum';

export const Auth = (...authType: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authType);
