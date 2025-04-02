import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignupDto } from './dtos/sign-up.dto';
import { SignInProvider } from './providers/sign-in/sign-in.provider';
import { SignUpProvider } from './providers/sign-up/sign-up.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinProvider: SignInProvider,
    private readonly signupProvider: SignUpProvider,
  ) {}
  public async signin(signinDto: SignInDto) {
    return this.signinProvider.signin(signinDto);
  }
  public async signup(signupDto: SignupDto) {
    return this.signupProvider.signup(signupDto);
  }
}
