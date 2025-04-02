import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindAllUsersProvider {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (err) {
      console.log('Error find all users: ', err);
      throw new InternalServerErrorException(
        'Unable to find all user. please try again later.',
      );
    }
  }
}
