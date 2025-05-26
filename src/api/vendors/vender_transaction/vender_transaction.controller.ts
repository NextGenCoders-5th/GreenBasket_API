import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserRole, Vendor } from '@prisma/client';
import { ActiveUser, Role } from 'src/api/auth/decorators';
import { IActiveUserData } from 'src/api/auth/interfaces/active-user-data.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VenderTransactionService } from './vender_transaction.service';

@Controller('vendor/transaction')
export class VenderTransactionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly venderTransactionService: VenderTransactionService,
  ) {}
  // get all transactions
  @ApiOperation({
    summary: 'Get All Transactions',
    description:
      'Get all taransactions. admins can use this route to get all transaction history.',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get()
  getAllTransactions() {
    return this.venderTransactionService.getAllTransactions();
  }

  // get vendor transaction
  @ApiOperation({
    summary: 'Get Vendor Transaction',
    description:
      'Get Vendor Transaction. admins and vendors can use this route to get transaction history',
  })
  @ApiQuery({
    name: 'id',
    description:
      'vendor id. admins can only get detail transaction by sending id. vendors can get their own only',
    required: false,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN, UserRole.VENDOR)
  @Get('/by-vendor')
  async getVendorTransactions(
    @Query('id') vendorId: string,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    const { role, sub: userId } = activeUserData;
    let vendor: Vendor;
    try {
      vendor = await this.prisma.vendor.findUnique({
        where: {
          ...(role === UserRole.VENDOR && { userId }),
          ...(role === UserRole.ADMIN && { vendorId }),
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find vendor, please try again later.',
      );
    }

    if (!vendor) {
      throw new NotFoundException('vendor not found.');
    }
    return this.venderTransactionService.getVendorTransactions(vendor.id);
  }
}
