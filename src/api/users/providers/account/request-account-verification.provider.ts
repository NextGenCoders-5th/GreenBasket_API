import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneUserProvider } from '../find-one-user.provider';
import { UserAccountVerifyStatus } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class RequestAccountVerificationProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneUserProvider: FindOneUserProvider,
  ) {}

  async requestAccountVerification(userId: string) {
    // check if users finishes his onboarding process.
    const user = await this.findOneUserProvider.findOneUser({
      id: userId,
      is_onboarding: false,
    });

    if (!user) {
      throw new BadRequestException(
        'User should complete the onboarding process first.',
      );
    }

    // check if account already verified
    if (
      user.verify_status === UserAccountVerifyStatus.REQUESTED ||
      user.verify_status === UserAccountVerifyStatus.VERIFIED
    ) {
      throw new BadRequestException(
        'User account is either verified or is beging requested.',
      );
    }

    // update verify_status to REQUESTED
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          verify_status: UserAccountVerifyStatus.REQUESTED,
        },
      });
    } catch (err) {
      console.log('requestAccountVerification error: ', err);
      throw new InternalServerErrorException(
        'Unable to request account verification. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'acount verification request successfull.',
      data: null,
    });
  }
}
