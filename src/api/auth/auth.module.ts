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
import { GenerateTokenProvider } from './providers/jwt-token/generate-token.provider';
import { RefreshTokenProvider } from './providers/jwt-token/refresh-token.provider';
import { SignInProvider } from './providers/sign-in/sign-in.provider';
import { SignUpProvider } from './providers/sign-up/sign-up.provider';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ForgotPasswordProvider } from './providers/password-reset/forgot-password.provider';
import { ResetPasswordProvider } from './providers/password-reset/reset-password.provider';
import { EmailModule } from 'src/common/email/email.module';
import { MessageModule } from 'src/common/message/message.module';

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
    GenerateTokenProvider,
    RefreshTokenProvider,
    SignInProvider,
    SignUpProvider,
    ForgotPasswordProvider,
    ResetPasswordProvider,
  ],
  imports: [
    PrismaModule,
    EmailModule,
    MessageModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [HashingProvider],
})
export class AuthModule {}
