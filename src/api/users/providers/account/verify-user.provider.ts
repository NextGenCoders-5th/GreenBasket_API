import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneUserProvider } from '../find-one-user.provider';
import { VerifyUserDto } from '../../dto';
import { UserAccountVerifyStatus } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class VerifyUserProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneUserProvider: FindOneUserProvider,
  ) {}

  public async verifyUser(verifyUserDto: VerifyUserDto) {
    const { userId, verify_status } = verifyUserDto;

    let user = await this.findOneUserProvider.findOneUser({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.is_onboarding) {
      throw new BadRequestException(
        'User not completed filling user information.',
      );
    }

    if (user.verify_status !== UserAccountVerifyStatus.REQUESTED) {
      throw new BadRequestException(
        'user has not requested to verify his account.',
      );
    }

    try {
      user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          verify_status,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to update user account verify status. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: `user account verify status changed to ${verify_status} successfully.`,
      data: user,
    });
  }
}
