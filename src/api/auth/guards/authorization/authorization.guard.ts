import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY, ROLES_KEY } from '../../constants/auth.constant';
import { UserRole } from '@prisma/client';
import { IActiveUserData } from '../../interfaces/active-user-data.interface';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!contextRoles) {
      console.log('access granted');
      return true;
    }

    const user: IActiveUserData = context.switchToHttp().getRequest<Request>()[
      REQUEST_USER_KEY
    ];

    if (!contextRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Access denied. you are not authorized to perform this action.',
      );
    }

    return true;
  }
}
