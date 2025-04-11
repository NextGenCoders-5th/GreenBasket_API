import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { FindAllAddressesProvider } from './providers/find-all-addresses.provider';
import { FindOneAddressProvider } from './providers/find-one-address.provider';
import { FindAddressByIdProvider } from './providers/find-address-by-id.provider';

@Injectable()
export class AddressesService {
  constructor(
    private readonly findOneAddressProvider: FindOneAddressProvider,
    private readonly findAllAddressesProvider: FindAllAddressesProvider,
    private readonly findAddressByIdProvider: FindAddressByIdProvider,
  ) {}
  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  findAllAddresses() {
    return this.findAllAddressesProvider.findAllAddresses();
  }

  findAddressById(id: string) {
    return this.findAddressByIdProvider.findAddressById(id);
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }

  findOneAddress(option: Partial<Address>) {
    return this.findOneAddressProvider.findOneAdress(option);
  }
}
