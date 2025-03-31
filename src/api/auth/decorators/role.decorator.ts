import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../constants/auth.constant';

export const Role = (...role: UserRole[]) => SetMetadata(ROLES_KEY, role);
