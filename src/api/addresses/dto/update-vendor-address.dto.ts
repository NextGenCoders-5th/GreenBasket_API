import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorAddressDto } from './create-vendor-address.dto';

export class UpdateVendorAddressDto extends PartialType(
  CreateVendorAddressDto,
) {}
