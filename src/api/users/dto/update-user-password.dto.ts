import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CheckPasswordConfirm } from 'src/common/decorators/check-password-confirm.decorator';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'users old or current password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password should at least be 8 characters' })
  oldPassword: string;

  @ApiProperty({
    description: 'users new password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password should at least be 8 characters' })
  password: string;

  @ApiProperty({
    description: 'confirm your password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password should at least be 8 characters' })
  passwordConfirm: string;

  @CheckPasswordConfirm({
    message: 'password and password confirm should be the same',
  })
  checkPasswordConfirm: string;
}
