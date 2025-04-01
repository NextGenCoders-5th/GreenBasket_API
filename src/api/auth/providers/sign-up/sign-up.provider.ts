import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignupDto } from '../../dtos/sign-up.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HashingProvider } from '../hash-password/hashing.provider';
import { User } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signup(signupDto: SignupDto) {
    const { email, password, phoneNumber } = signupDto;

    let user: User | undefined;

    try {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone_number: phoneNumber }],
        },
      });
    } catch (err) {
      console.log('error fetching user: ', err);
      throw new InternalServerErrorException(
        'Unable to fetch user. please try again later',
      );
    }

    if (user) {
      throw new BadRequestException(
        'User with this email or phone number already exists.',
      );
    }

    try {
      user = await this.prisma.user.create({
        data: {
          email,
          password: await this.hashingProvider.hashPassword(password),
          phone_number: phoneNumber,
          first_name: null,
          last_name: null,
        },
      });
    } catch (err) {
      console.log('error when saving user data: ', err);
      throw new InternalServerErrorException(
        'Unable to create a signup a user. please try again later',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'sign up success full',
      data: user,
    });
  }
}
