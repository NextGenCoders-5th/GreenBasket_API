import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinDate,
} from 'class-validator';

export class CompleteOnboardingDto {
  @ApiProperty({
    description: 'first name of the user.',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'last name of the user.',
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'date of birth.',
  })
  @IsNotEmpty()
  @IsDateString()
  @MinDate(new Date('1950-01-01'))
  date_of_birth: string;

  @ApiProperty({
    description: 'gender of user',
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Profile picture of the user (file upload)',
    type: 'string',
    format: 'binary',
    required: true,
  })
  profile_picture: string;

  @ApiProperty({
    description: 'users identification card photo front page',
    required: true,
    type: 'string',
    format: 'binary',
  })
  idPhoto_front: string;

  @ApiProperty({
    description: 'users identification card photo front page',
    required: true,
    type: 'string',
    format: 'binary',
  })
  idPhoto_back: string;

  userId: string;
}
