import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';
import { VendorBankAccountService } from './vendor_bank_account.service';
import { CreateBankAccountDto } from './dtos/create-back-account.dto';
import { ActiveUser, Role } from 'src/api/auth/decorators';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { VendorsService } from '../vendors/vendors.service';

@Controller('vendor/bank-account')
export class VendorBankAccountController {
  constructor(
    private readonly vendorBankAccountService: VendorBankAccountService,
    private readonly vendorsService: VendorsService,
  ) {}

  @ApiOperation({
    summary: 'create bank account',
    description: 'vendors can use this endpoint to create bank account.',
  })
  @ApiBody({
    type: CreateBankAccountDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Post()
  async createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @ActiveUser('sub') sub: string,
  ) {
    const vendor = await this.vendorsService.findOneVendor({
      userId: sub,
    });
    if (!vendor) throw new NotFoundException('vendor not found.');
    createBankAccountDto.vendorId = vendor.id;
    return this.vendorBankAccountService.createBankAccount(
      createBankAccountDto,
    );
  }

  @ApiOperation({
    summary: 'update bank account',
    description: 'vendors can use this endpoint to update bank account.',
  })
  @ApiBody({
    type: UpdateBankAccountDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Patch()
  async updateBankAccount(
    @ActiveUser('sub') sub: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const vendor = await this.vendorsService.findOneVendor({
      userId: sub,
    });
    if (!vendor) throw new NotFoundException('vendor not found.');
    if (!vendor.have_bank_details) {
      throw new BadRequestException('Vendor has no bank account');
    }
    updateBankAccountDto.vendorId = vendor.id;

    return this.vendorBankAccountService.updateBankAccount(
      updateBankAccountDto,
    );
  }
}
