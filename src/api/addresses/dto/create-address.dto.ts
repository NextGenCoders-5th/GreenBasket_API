import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'country name' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ description: 'city name' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'sub city name' })
  @IsNotEmpty()
  @IsString()
  sub_city: string;

  @ApiProperty({
    description: 'street address',
  })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiPropertyOptional({ description: 'postal code' })
  @IsNotEmpty()
  @IsString()
  zip_code: string;

  @ApiPropertyOptional({ description: 'geolocation - latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'geolocation - longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
