import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserAccountVerifyStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllVerificationRequestsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllVerificationRequests() {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          verify_status: UserAccountVerifyStatus.REQUESTED,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'find all verification requests succfull.',
        data: user,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find all verification requests. please try again later.',
      );
    }
  }
}
