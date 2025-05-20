import { Body, Controller, Patch, Post } from '@nestjs/common';
import { VendorBankAccountService } from './vendor_bank_account.service';
import { CreateBankAccountDto } from './dtos/create-back-account.dto';
import { ActiveUser, Role } from 'src/api/auth/decorators';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

@Controller('vendor/bank-account')
export class VendorBankAccountController {
  constructor(
    private readonly vendorBankAccountService: VendorBankAccountService,
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
  createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @ActiveUser('sub') id: string,
  ) {
    createBankAccountDto.vendorId = id;
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
  updateBankAccount(
    @ActiveUser('sub') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    updateBankAccountDto.vendorId = id;
    return this.vendorBankAccountService.updateBankAccount(
      id,
      updateBankAccountDto,
    );
  }
}
