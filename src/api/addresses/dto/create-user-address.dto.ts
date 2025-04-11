import { CreateAddressDto } from './create-address.dto';

export class CreateUserAddressDto extends CreateAddressDto {
  userId: string;
}
