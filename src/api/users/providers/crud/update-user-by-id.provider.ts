import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { UpdateUserDto } from '../../dto';
import { FindOneUserProvider } from '../find-one-user.provider';

@Injectable()
export class UpdateUserByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneUserProvider: FindOneUserProvider,
  ) {}

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    // check if user still exists
    let user: User | undefined;
    try {
      user = await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (err) {
      console.log('unable to fetch a user: ', err);
      throw new InternalServerErrorException(
        'unable to fetch a user. please try again later.',
      );
    }

    if (!user) {
      throw new NotFoundException('User not found to update.');
    }

    // check if email is provided and is different from the current email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findOneUserProvider.findOneUser({
        email: updateUserDto.email,
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with this email, Please use another email',
        );
      }
    }
    // check if phone number is provided and is different from the current phone number
    if (
      updateUserDto.phoneNumber &&
      updateUserDto.phoneNumber !== user.phone_number
    ) {
      const existingUser = await this.findOneUserProvider.findOneUser({
        phone_number: updateUserDto.phoneNumber,
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with this phone number, Please use another phone number',
        );
      }
    }

    // updated user body
    const updatedBody: Partial<User> = {};
    updatedBody.first_name = updateUserDto.firstName ?? user.first_name;
    updatedBody.last_name = updateUserDto.lastName ?? user.last_name;
    updatedBody.email = updateUserDto.email ?? user.email;
    updatedBody.phone_number = updateUserDto.phoneNumber ?? user.phone_number;
    updatedBody.role = updateUserDto.role ?? user.role;

    try {
      user = await this.prisma.user.update({
        where: { id },
        data: updatedBody,
      });
    } catch (err) {
      console.log('unable to update user: ', err);
      throw new InternalServerErrorException(
        'Unable to update user. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'update user successfull',
      data: user,
    });
  }
}
