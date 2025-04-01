import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthProvider, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignInDto } from '../../dtos/sign-in.dto';
import { HashingProvider } from '../hash-password/hashing.provider';
import { GenerateTokenProvider } from '../jwt-token/generate-token.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}
  public async signin(signinDto: SignInDto) {
    const { email, password, phoneNumber } = signinDto;

    // if both email and phone number are provided throw bad request error
    if (email && phoneNumber) {
      throw new BadRequestException(
        'choose sign in method. Use either email or phone number.',
      );
    }
    // check if the user exists
    let user: User | undefined;
    try {
      user = email
        ? await this.prisma.user.findFirst({
            where: { email },
          })
        : await this.prisma.user.findFirst({
            where: {
              phone_number: phoneNumber,
            },
          });
    } catch (err) {
      console.log('error fetching user. ', err);
      throw new InternalServerErrorException(
        'Unable to fetch user. please try again later.',
      );
    }

    if (!user) {
      throw new BadRequestException(
        'user not found. please check your email or phone number and try again later.',
      );
    }
    // check the auth provider
    if (user.authProvider !== AuthProvider.EMAIL) {
      throw new BadRequestException(
        `Please login via ${user.authProvider} provider.`,
      );
    }
    // check password is correct by comparing it
    const isCorrect = await this.hashingProvider.comparePassword(
      password,
      user.password,
    );

    if (!isCorrect) {
      throw new BadRequestException('Invalid credentials. try again later.');
    }

    // sign a new token and return success message
    const { accessToken, refreshToken } =
      await this.generateTokenProvider.generateToken(user);

    return CreateApiResponse({
      status: 'success',
      message: 'signin successfull',
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  }
}
