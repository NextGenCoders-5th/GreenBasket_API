import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindUserAddressByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findUserAdressById(userId: string) {
    if (!userId) throw new NotFoundException('user id not found.');
    try {
      const address = await this.prisma.address.findFirst({
        where: { userId },
        include: {
          User: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true,
            },
          },
        },
      });

      if (!address) {
        return CreateApiResponse({
          status: 'error',
          message: 'User has no address yet.',
          data: null,
        });
      }

      return CreateApiResponse({
        status: 'success',
        message: 'find user address successfull.',
        data: address,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find user address. please try again later.',
      );
    }
  }
}
