import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { Vendor } from '@prisma/client';
import { FindOneVendorProvider } from './find-one-vendor.provider';
import { UsersService } from 'src/api/users/users.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@Injectable()
export class UpdateVendorProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly findOneVendorProvider: FindOneVendorProvider,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async updateVendor(id: string, updateVendorDto: UpdateVendorDto) {
    const { business_email, business_name, phone_number, logo_url, userId } =
      updateVendorDto;
    let vendor: Vendor | undefined;

    // check if vendor exists
    vendor = await this.findOneVendorProvider.findOneVendor({ id });

    if (!vendor) {
      throw new BadRequestException('vendor not found');
    }

    if (userId) {
      // check if valid user id and if user still exists
      const user = await this.usersService.findOneUser({
        id: userId,
      });

      if (!user) {
        throw new NotFoundException(
          'user not found when creating a vendor, try again later',
        );
      }
    }
    // fixeme
    // check if vendor already exists with the same email or phone number
    let existingVendor: Vendor;
    try {
      existingVendor = await this.prisma.vendor.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: [{ business_email }, { phone_number }],
        },
      });
    } catch (err) {
      console.log('unable to find vendor by email or phone number', err);
      throw new InternalServerErrorException(
        'unable to find a vendor, please try again later.',
      );
    }
    if (existingVendor) {
      throw new BadRequestException(
        'vendor already exists with the same phone number or business email. ',
      );
    }
    // remove file if new logo uploaded then update vendor
    if (logo_url && vendor.logo_url) {
      this.fileUploadService.removeFile(vendor.logo_url);
    }

    // update vendor
    try {
      vendor = await this.prisma.vendor.update({
        where: { id },
        data: {
          business_email: business_email ?? vendor.business_email,
          business_name: business_name ?? vendor.business_name,
          phone_number: phone_number ?? vendor.phone_number,
          logo_url: logo_url ?? vendor.logo_url,
          userId: userId ?? vendor.userId,
        },
      });
    } catch (err) {
      console.log('update vendor provider', err);
      throw new InternalServerErrorException(
        'Unable to find vendor, please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'update vendor successfull.',
      data: vendor,
    });
  }
}
