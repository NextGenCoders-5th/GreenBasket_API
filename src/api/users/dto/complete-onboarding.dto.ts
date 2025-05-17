import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
