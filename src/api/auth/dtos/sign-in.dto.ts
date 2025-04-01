import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EmailOrPhone } from 'src/common/decorators/email-or-phone.decorator';

export class SignInDto {
  @ApiPropertyOptional({
    description:
      'email of the user. either email or phoneNumber must be provided.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'phoneNumber of the user. either phoneNumber or email is required to be able to signin.',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'user password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @EmailOrPhone({
    message: 'Either email or phoneNumber must be provided.',
  })
  emailOrPhone: string;
}
