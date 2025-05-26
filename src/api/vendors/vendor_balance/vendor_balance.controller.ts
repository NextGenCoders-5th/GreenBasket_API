import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserRole, Vendor } from '@prisma/client';
import { ActiveUser, Role } from 'src/api/auth/decorators';
import { IActiveUserData } from 'src/api/auth/interfaces/active-user-data.interface';
import { VendorsService } from '../vendors/vendors.service';
import { VendorBalanceService } from './vendor_balance.service';

@Controller('vendor/balance')
export class VendorBalanceController {
  constructor(
    private readonly vendorBalanceService: VendorBalanceService,
    private readonly vendorsService: VendorsService,
  ) {}

  @ApiOperation({
    summary: 'Initialize vendor balance',
    description:
      'Initialize vendor balance. when the vendor is created it is initialized authomatically. but incase it is not you can initialize it useing this route.',
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Post()
  async initializeVendorBalance(@ActiveUser() activeUserData: IActiveUserData) {
    const { sub } = activeUserData;
    const vendor = await this.vendorsService.findOneVendor({
      userId: sub,
    });
    if (!vendor) throw new NotFoundException('vendor not found.');

    return this.vendorBalanceService.initializeVendorBalance(vendor.id);
  }

  @ApiOperation({
    summary: 'Get Vendor Balance.',
    description: 'Get Vendor Balance.',
  })
  @ApiQuery({
    name: 'userId',
    description:
      'admins can get the Get Vendor Balance. of vendors. userId is the id of ther user who owns the vendor.',
    required: false,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR, UserRole.ADMIN)
  @Get()
  async getVendorBalance(
    @Query('userId') userId: string,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    const { role, sub } = activeUserData;
    let vendorId: string;
    let vendor: Vendor;
    if (role === UserRole.VENDOR) {
      vendor = await this.vendorsService.findOneVendor({
        userId: sub,
      });
      if (!vendor) throw new NotFoundException('vendor not found.');
      vendorId = vendor.id;
    } else {
      if (!userId) throw new BadRequestException('user id is required.');

      vendor = await this.vendorsService.findOneVendor({
        userId,
      });
      if (!vendor) throw new NotFoundException('vendor not found.');
      vendorId = vendor.id;
    }
    return this.vendorBalanceService.getVendorBalance(vendorId);
  }
}
