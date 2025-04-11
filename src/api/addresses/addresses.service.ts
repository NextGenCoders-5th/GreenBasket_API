import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from '@prisma/client';
import { FindOneAddressProvider } from './providers/find-one-address.provider';

@Injectable()
export class AddressesService {
  constructor(
    private readonly findOneAddressProvider: FindOneAddressProvider,
  ) {}
  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
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
