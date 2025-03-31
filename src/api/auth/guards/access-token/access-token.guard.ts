import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ACCESS_TOKEN, REQUEST_USER_KEY } from '../../constants/auth.constant';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from 'src/common/configuration/config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'you are not logged in. please login to get access.',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired token. please login to get access',
      );
    }

    return true;
  }

  private extractToken(request: Request) {
    const authHeader = request.headers.authorization;
    // if token is bearer token
    if (authHeader) {
      return authHeader.split(' ')[1];
    }

    // if token is not in the auth header then check the cookie
    return request.cookies?.[ACCESS_TOKEN];
  }
}
