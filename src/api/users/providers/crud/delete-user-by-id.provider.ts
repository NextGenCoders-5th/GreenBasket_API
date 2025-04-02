import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class DeleteUserByIdProvider {
  constructor(private readonly prisma: PrismaService) {}
  async deleteUserById(id: string) {
    try {
      const users = await this.prisma.user.delete({ where: { id } });
      return users;
    } catch (err) {
      console.log('Error delete user: ', err);
      throw new InternalServerErrorException(
        'Unable to delete user. please try again later.',
      );
    }
  }
}
