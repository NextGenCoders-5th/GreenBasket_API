import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export default class UpdateUserDataDto {
  @ApiProperty({
    description: 'user first name',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'user last name',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'user email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'user phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
