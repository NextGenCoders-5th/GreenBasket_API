import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorProvider } from './providers/create-vendor.provider';
import { DeleteVendorProvider } from './providers/delete-vendor.provider';

@Injectable()
export class VendorsService {
  constructor(
    private readonly createVendorProvider: CreateVendorProvider,
    private readonly deleteVendorProvider: DeleteVendorProvider,
  ) {}
  createVendor(createVendorDto: CreateVendorDto) {
    return this.createVendorProvider.createVendor(createVendorDto);
  }

  findAll() {
    return `This action returns all vendors`;
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
