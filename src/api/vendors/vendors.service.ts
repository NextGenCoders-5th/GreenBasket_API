import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorProvider } from './providers/create-vendor.provider';
import { DeleteVendorProvider } from './providers/delete-vendor.provider';
import { FindAllVendorsProvider } from './providers/find-all-vendors.provider';
import { FindVendorByIdProvider } from './providers/find-vendor-by-id.provider';
import { UpdateVendorProvider } from './providers/update-vendor.provider';

@Injectable()
export class VendorsService {
  constructor(
    private readonly createVendorProvider: CreateVendorProvider,
    private readonly deleteVendorProvider: DeleteVendorProvider,
    private readonly findAllVendorsProvider: FindAllVendorsProvider,
    private readonly findVendorByIdProvider: FindVendorByIdProvider,
    private readonly updateVendorProvider: UpdateVendorProvider,
  ) {}
  createVendor(createVendorDto: CreateVendorDto) {
    return this.createVendorProvider.createVendor(createVendorDto);
  }

  findAllVendors() {
    return this.findAllVendorsProvider.findAllVendors();
  }

  findVendorById(id: string) {
    return this.findVendorByIdProvider.findVendorById(id);
  }

  updateVendor(id: string, updateVendorDto: UpdateVendorDto) {
    return this.updateVendorProvider.updateVendor(id, updateVendorDto);
  }

  deleteVendor(id: string) {
    return this.deleteVendorProvider.deleteVendr(id);
  }
}
