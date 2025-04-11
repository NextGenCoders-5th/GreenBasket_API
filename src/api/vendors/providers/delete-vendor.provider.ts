import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneVendorProvider } from './find-one-vendor.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@Injectable()
export class DeleteVendorProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneVendorProvider: FindOneVendorProvider,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async deleteVendr(id: string) {
    // check if vendor exists before deleting
    const vendor = await this.findOneVendorProvider.findOneVendor({ id });

    if (!vendor) {
      throw new BadRequestException('vendor not found.');
    }

    // delete vendor
    try {
      await this.prisma.vendor.delete({ where: { id } });
      // clear files related to this vendor
      this.fileUploadService.removeFile(vendor.logo_url);
    } catch (err) {
      console.log('delete vendor: ', err);
      throw new InternalServerErrorException(
        'unable to delete vendor please try again later',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'vendor delete successfully.',
      data: null,
    });
  }
}
