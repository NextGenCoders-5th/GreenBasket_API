import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export default class CreateUserDto {
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

  @ApiProperty({
    description: 'user role',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
