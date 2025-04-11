import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorProvider } from './providers/create-vendor.provider';
import { DeleteVendorProvider } from './providers/delete-vendor.provider';
import { FindAllVendorsProvider } from './providers/find-all-vendors.provider';

@Injectable()
export class VendorsService {
  constructor(
    private readonly createVendorProvider: CreateVendorProvider,
    private readonly deleteVendorProvider: DeleteVendorProvider,
    private readonly findAllVendorsProvider: FindAllVendorsProvider,
  ) {}
  createVendor(createVendorDto: CreateVendorDto) {
    return this.createVendorProvider.createVendor(createVendorDto);
  }

  findAllVendors() {
    return this.findAllVendorsProvider.findAllVendors();
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  deleteVendor(id: string) {
    return this.deleteVendorProvider.deleteVendr(id);
  }
}
