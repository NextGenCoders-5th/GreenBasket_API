import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CompleteOnboardingDto } from '../../dto/complete-onboarding.dto';
import { User } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class CompleteOnboardingProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async completeOnboarding(
    completeOnboardingDto: CompleteOnboardingDto,
  ) {
    const {
      first_name,
      last_name,
      idPhoto_back,
      idPhoto_front,
      userId,
      profile_picture,
    } = completeOnboardingDto;

    let user: User;
    try {
      user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          first_name,
          last_name,
          idPhoto_front,
          idPhoto_back,
          profile_picture,
          is_onboarding: false,
        },
      });
    } catch (err) {
      console.log('complete Onboarding Error: ', err);
      throw new InternalServerErrorException(
        'Unable to complete the onboarding process.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'complete onboarding process successfull.',
      data: user,
    });
  }
}
