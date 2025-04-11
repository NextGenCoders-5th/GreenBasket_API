import { CreateAddressDto } from '../create-address.dto';

export class CreateVendorAddressDto extends CreateAddressDto {
  userId: string;
  vendorId: string;
}
