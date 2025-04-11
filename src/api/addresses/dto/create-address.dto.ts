import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'street address',
  })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'city name' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'sub city name' })
  @IsNotEmpty()
  @IsString()
  sub_city: string;

  @ApiPropertyOptional({ description: 'postal code' })
  @IsNotEmpty()
  @IsString()
  zip_code: string;

  @ApiPropertyOptional({ description: 'country name' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiPropertyOptional({ description: 'geolocation - latitude' })
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional({ description: 'geolocation - longitude' })
  @IsNumber()
  longitude: number;
}
