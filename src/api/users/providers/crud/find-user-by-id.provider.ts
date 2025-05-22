import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindUserByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string) {
    let user: User | undefined;

    try {
      user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          Review: true,
          address: true,
          cart: true,
          orders: true,
          vendor: true,
        },
      });
    } catch (err) {
      console.log('find user by id', err);
      throw new InternalServerErrorException(
        'Unable to fetch a user at the moment. please try again later',
      );
    }

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'fetch user by id successfull',
      data: user,
    });
  }
}
