import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignupDto } from './dtos/sign-up.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { Response } from 'express';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/auth.constant';
import { ConfigService } from '@nestjs/config';
import { Auth } from './decorators';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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

  @ApiOperation({
    summary: 'forgot password.',
    description:
      'forgot your password? use this endpoint to get the reset token.',
  })
  @ApiBody({
    type: ForgotPasswordDto,
    required: true,
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotMyPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotMyPassword(forgotPasswordDto);
  }

  // reset my password
  @ApiOperation({
    summary: 'Reset My Password',
    description:
      'Reset My Password. Use this route to reset you password  incase you forgot it. you will recieve an email or sms message with the reset url.',
  })
  @ApiBody({
    type: ResetPasswordDto,
    required: true,
  })
  @ApiParam({
    name: 'resetToken',
    required: true,
    description: 'reset token you get from the email or sms reset url',
  })
  @Auth(AuthType.NONE)
  @Post('reset-password/:resetToken')
  @HttpCode(HttpStatus.OK)
  public resetMyPassword(
    @Param('resetToken') resetToken: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetMyPassword(resetToken, resetPasswordDto);
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout a user. use this endpoint to logout a user.',
  })
  @ApiBearerAuth()
  @Patch('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);
    return {
      stats: 'success',
      message: 'Logout successful',
    };
  }
}
