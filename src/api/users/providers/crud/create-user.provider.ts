import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { HashingProvider } from 'src/api/auth/providers/hash-password/hashing.provider';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly hashingProvider: HashingProvider,
    private readonly prisma: PrismaService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // admin creates a user with default system password.
    let user: User | undefined;

    try {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: createUserDto.email },
            { phone_number: createUserDto.phoneNumber },
          ],
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
          email: createUserDto.email,
          password: await this.hashingProvider.hashPassword(
            this.configService.get<string>('appConfig.defaultSysPassword'),
          ),
          phone_number: createUserDto.phoneNumber,
          first_name: createUserDto.firstName,
          last_name: createUserDto.lastName,
          role: createUserDto.role,
          need_reset_password: true,
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
