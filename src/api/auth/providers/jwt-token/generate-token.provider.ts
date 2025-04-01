import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtConfig } from 'src/common/configuration/config';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    // inject jwt service
    private readonly jwtService: JwtService,

    // inject jwt configuration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  // sign token method
  public async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    const token = this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      },
    );

    return token;
  }
  // generate token method
  public async generateToken(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
        role: user.role,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        email: user.email,
        role: user.role,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
