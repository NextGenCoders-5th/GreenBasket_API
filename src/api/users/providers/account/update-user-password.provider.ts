import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneUserProvider } from '../find-one-user.provider';
import { UpdateUserPasswordDto } from '../../dto';
import { HashingProvider } from 'src/api/auth/providers/hash-password/hashing.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateUserPasswordProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneUserProvider: FindOneUserProvider,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async updateUserPassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const { password, oldPassword } = updateUserPasswordDto;
    // check if the user still exists
    let user = await this.findOneUserProvider.findOneUser({ id });

    if (!user) {
      throw new NotFoundException('User not found to update.');
    }

    // compare if the old password is correct password
    const isCorrect = this.hashingProvider.comparePassword(
      oldPassword,
      user.password,
    );

    if (!isCorrect) {
      throw new BadRequestException(
        'Incorrect password. please make sure you put correct password. if you dont remember you can reset your password.',
      );
    }

    // update password
    try {
      user = await this.prisma.user.update({
        where: { id },
        data: {
          password: await this.hashingProvider.hashPassword(password),
        },
      });
    } catch (err) {
      console.log('Unable to update password please try again later: ', err);
      throw new InternalServerErrorException(
        'Unable to update password please try again later',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'password update successfully',
      data: user,
    });
  }
}
