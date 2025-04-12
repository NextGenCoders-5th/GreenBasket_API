import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignupDto } from './dtos/sign-up.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { Response } from 'express';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/auth.constant';
import { ConfigService } from '@nestjs/config';
import { Auth } from './decorators';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Signup a User',
    description: 'Signup a User. use this route to signup a new user.',
  })
  @ApiBody({
    type: SignupDto,
    required: true,
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({
    summary: 'Signin/Login a user',
    description: 'Signin/Login a user. use this endpoint to login a user.',
  })
  @ApiBody({
    type: SignInDto,
    required: true,
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signin(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signin(signinDto);
    // Set access token as an HTTP-only secure cookie
    res.cookie(ACCESS_TOKEN, data.data.accessToken, {
      httpOnly: true,
      secure: true, // Ensure secure (HTTPS) in production
      maxAge: this.configService.get('cookieConfig.accessTokenExpiresIn'),
    });
    // Set refresh token as an HTTP-only secure cookie
    res.cookie(REFRESH_TOKEN, data.data.refreshToken, {
      httpOnly: true,
      secure: true, // Ensure secure (HTTPS) in production
      maxAge: this.configService.get('cookieConfig.refreshTokenExpiresIn'),
    });

    return data;
  }

  @ApiOperation({
    summary: 'Refresh Token',
  })
  @ApiBody({
    type: RefreshTokenDto,
    required: true,
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
