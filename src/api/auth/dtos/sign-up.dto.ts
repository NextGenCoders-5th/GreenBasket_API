import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { CheckPasswordConfirm } from 'src/common/decorators/check-password-confirm.decorator';

export class SignupDto {
  @ApiProperty({
    description: 'email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'your password.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'password length should at least be 8 characters' })
  password: string;

  @ApiProperty({
    description: 'confirm your password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'password length should at least be 8 characters' })
  passwordConfirm: string;

  @CheckPasswordConfirm({
    message: 'password and password confirm should be the same',
  })
  checkPasswordConfirm: string;
}
