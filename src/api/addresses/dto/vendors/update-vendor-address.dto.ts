import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateVendorAddressDto } from './create-vendor-address.dto';

export class UpdateVendorAddressDto extends PartialType(
  CreateVendorAddressDto,
) {
  @ApiProperty({
    description: 'address id.',
  })
  @IsNotEmpty()
  @IsUUID()
  addressId: string;
}
