import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/configuration/config';
import { GenerateTokenProvider } from './generate-token.provider';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RefreshTokenDto } from '../../dtos/refresh-token.dto';
import { IActiveUserData } from '../../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokenProvider: GenerateTokenProvider,
    private readonly prisma: PrismaService,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<IActiveUserData>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: sub },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials provided.');
      }

      const tokens = await this.generateTokenProvider.generateToken(user);
      return tokens;
    } catch (err) {
      console.log('err when refreshing token: ', err);
      throw new BadRequestException(
        (err as Error).message ||
          'Unable to refresh token at the moment. please try again later',
      );
    }
  }
}
