import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignupDto } from './dtos/sign-up.dto';
import { SignInProvider } from './providers/sign-in/sign-in.provider';
import { SignUpProvider } from './providers/sign-up/sign-up.provider';
import { RefreshTokenProvider } from './providers/jwt-token/refresh-token.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ForgotPasswordProvider } from './providers/password-reset/forgot-password.provider';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ResetPasswordProvider } from './providers/password-reset/reset-password.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinProvider: SignInProvider,
    private readonly signupProvider: SignUpProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
  ) {}
  signin(signinDto: SignInDto) {
    return this.signinProvider.signin(signinDto);
  }

  signup(signupDto: SignupDto) {
    return this.signupProvider.signup(signupDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }

  forgotMyPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordProvider.forgotMyPassword(forgotPasswordDto);
  }

  resetMyPassword(resetToken: string, resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordProvider.resetMyPassword(
      resetToken,
      resetPasswordDto,
    );
  }
}
