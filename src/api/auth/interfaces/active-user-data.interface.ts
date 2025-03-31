import { UserRole } from '@prisma/client';

export interface IActiveUserData {
  sub: string;
  email: string;
  role: UserRole;
}
