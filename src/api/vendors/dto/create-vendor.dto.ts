import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({
    description: 'business name',
  })
  @IsNotEmpty()
  @IsString()
  business_name: string;

  @ApiProperty({
    description: 'business email',
  })
  @IsNotEmpty()
  @IsEmail()
  business_email: string;

  @ApiProperty({
    description: 'business phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'business logo',
    required: true,
  })
  //  for the frontend to send the file as a base64 string
  logo: string;
  // for the backend to save the file as a string
  logo_url: string;

  @ApiProperty({
    description: 'user id',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
