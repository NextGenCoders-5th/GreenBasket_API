import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDataDto } from '../../dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneUserProvider } from '../find-one-user.provider';
import { User } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateUserDataProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneUserProvider: FindOneUserProvider,
  ) {}

  public async updateUserData(
    id: string,
    updateUserDataDto: UpdateUserDataDto,
  ) {
    // check if user still exists
    let user: User | undefined;
    const { email, firstName, lastName, phoneNumber } = updateUserDataDto;

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
    if (email && email !== user.email) {
      const existingUser = await this.findOneUserProvider.findOneUser({
        email,
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with this email, Please use another email',
        );
      }
    }
    // check if phone number is provided and is different from the current phone number
    if (phoneNumber && phoneNumber !== user.phone_number) {
      const existingUser = await this.findOneUserProvider.findOneUser({
        phone_number: phoneNumber,
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with this phone number, Please use another phone number',
        );
      }
    }

    // updated user body
    const updatedBody: Partial<User> = {};
    updatedBody.first_name = firstName ?? user.first_name;
    updatedBody.last_name = lastName ?? user.last_name;
    updatedBody.email = email ?? user.email;
    updatedBody.phone_number = phoneNumber ?? user.phone_number;

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
