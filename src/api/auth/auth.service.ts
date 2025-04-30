import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignupDto } from './dtos/sign-up.dto';
import { SignInProvider } from './providers/sign-in/sign-in.provider';
import { SignUpProvider } from './providers/sign-up/sign-up.provider';
import { RefreshTokenProvider } from './providers/jwt-token/refresh-token.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinProvider: SignInProvider,
    private readonly signupProvider: SignUpProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
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
}
