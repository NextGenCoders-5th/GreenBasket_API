import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, Vendor } from '@prisma/client';
import { UsersService } from 'src/api/users/users.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { FindOneVendorProvider } from './find-one-vendor.provider';
import { VendorBalanceService } from '../../vendor_balance/vendor_balance.service';

@Injectable()
export class CreateVendorProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly findOneVendorProvider: FindOneVendorProvider,
    private readonly vendorBalanceService: VendorBalanceService,
  ) {}

  public async createVendor(createVendorDto: CreateVendorDto) {
    const { business_email, business_name, logo_url, phone_number, userId } =
      createVendorDto;
    // check if valid user id and if user still exists
    const user = await this.usersService.findOneUser({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(
        'user not found when creating a vendor, try again later',
      );
    }

    // check if user is already a vendor
    let vendor: Vendor | undefined;
    vendor = await this.findOneVendorProvider.findOneVendor({
      userId: userId,
    });

    if (vendor) {
      throw new BadRequestException('User already registered as a vendor. ');
    }

    // check if vendor already exists with the same email or phone number
    try {
      vendor = await this.prisma.vendor.findFirst({
        where: {
          OR: [{ business_email }, { phone_number }],
        },
      });
    } catch (err) {
      console.log('unable to find vendor by email or phone number', err);
      throw new InternalServerErrorException(
        'unable to find a vendor, please try again later.',
      );
    }

    if (vendor) {
      throw new BadRequestException(
        'vendor already exists with the same phone number or business email. ',
      );
    }

    try {
      // create vendor
      await this.prisma.$transaction(async (tx) => {
        vendor = await tx.vendor.create({
          data: {
            business_email,
            business_name,
            phone_number,
            logo_url,
            userId,
          },
        });
        await this.vendorBalanceService.initializeVendorBalance(vendor.id);
      });
      // update user role to vendor
      await this.prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.VENDOR },
      });
    } catch (err) {
      console.log('unable to create a vendor. please try again later.', err);
      throw new InternalServerErrorException(
        'unable to create a vendor. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'vendor created successfully',
      data: vendor,
    });
  }
}
