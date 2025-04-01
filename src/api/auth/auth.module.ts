import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/configuration/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AuthorizationGuard } from './guards/authorization/authorization.guard';
import { BcryptProvider } from './providers/hash-password/bcrypt.provider';
import { HashingProvider } from './providers/hash-password/hashing.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    AccessTokenGuard,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
