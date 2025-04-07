import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

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
  logo_url: string;
}
