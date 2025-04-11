import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserAddressDto extends CreateAddressDto {
  @ApiPropertyOptional({ description: 'vendor id.' })
  @IsString()
  userId?: string;
}
