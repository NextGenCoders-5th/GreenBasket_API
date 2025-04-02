import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneUserProvider {
  constructor(private readonly prisma: PrismaService) {}

  async findOneUser(options: Partial<User>) {
    try {
      return await this.prisma.user.findFirst({ where: options });
    } catch (err) {
      console.log('find one user provider: ', err);
      throw new InternalServerErrorException(
        'Unable to fetch a user. please try again later.',
      );
    }
  }
}
