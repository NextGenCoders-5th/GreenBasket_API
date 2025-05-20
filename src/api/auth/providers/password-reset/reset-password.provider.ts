import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HashingProvider } from '../hash-password/hashing.provider';
import { ResetPasswordDto } from '../../dtos/reset-password.dto';
import { User } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class ResetPasswordProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async resetMyPassword(
    resetToken: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    let user: User;
    try {
      user = await this.prisma.user.findFirst({
        where: {
          reset_password_token: crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex'),
          reset_password_token_expires_at: {
            gt: new Date(),
          },
        },
      });
    } catch (err) {
      console.error('Error finding user:', err);
      throw new InternalServerErrorException(
        'Unable to find a user. Please try again later.',
      );
    }

    if (!user) {
      throw new BadRequestException(
        'Invalid or expired token. please try again.',
      );
    }

    try {
      const password = await this.hashingProvider.hashPassword(
        resetPasswordDto.password,
      );
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          reset_password_token: null,
          reset_password_token_expires_at: null,
          password,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to reset password, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'password reset successfull, now you can login to your account.',
      data: null,
    });
  }
}
