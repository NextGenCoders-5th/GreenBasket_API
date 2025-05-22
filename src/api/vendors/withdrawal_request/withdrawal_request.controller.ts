import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole, Vendor } from '@prisma/client';
import { ActiveUser, Role } from 'src/api/auth/decorators';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateWithdrawalRequestDto } from './dtos/create-withdrawal-request.dto';
import { WithdrawalRequestService } from './withdrawal_request.service';
import { IActiveUserData } from 'src/api/auth/interfaces/active-user-data.interface';
import { ProcessWithdrawalDto } from './dtos/process-withdrawal.dto';

@Controller('vendor/withdrawal-request')
export class WithdrawalRequestController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly withdrawalRequestService: WithdrawalRequestService,
  ) {}

  // Create withdrawal request
  @ApiOperation({
    summary: 'Create withdrawal request',
    description: 'Create withdrawal request',
  })
  @ApiBody({
    type: CreateWithdrawalRequestDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Post()
  async createWithdrawalRequest(
    @Body() createWithdrawalRequestDto: CreateWithdrawalRequestDto,
    @ActiveUser('sub') userId: string,
  ) {
    createWithdrawalRequestDto.userId = userId;
    return this.withdrawalRequestService.createWithdrawalRequest(
      createWithdrawalRequestDto,
    );
  }

  // Get vendor's withdrawal requests
  @ApiOperation({
    summary: "Get vendor's withdrawal requests",
    description: "Get vendor's withdrawal requests",
  })
  @ApiQuery({
    name: 'vendorId',
    description:
      'admins can send vendor id on the query and geet details about that vendor.',
    required: false,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN, UserRole.VENDOR)
  @Get()
  async getVendorWithdrawals(
    @Query('vendorId') vendorId: string,
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

    return this.withdrawalRequestService.getVendorWithdrawals(vendor.id);
  }

  // Admin: Process withdrawal request
  @ApiOperation({
    summary: 'Admin: Process withdrawal request',
    description: 'Admin: Process withdrawal request',
  })
  @ApiBody({
    type: ProcessWithdrawalDto,
    required: true,
  })
  @ApiParam({
    description: 'withdrawal request id',
    name: 'withdrawalRequestId',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Patch(':withdrawalRequestId')
  async processWithdrawal(
    @Param('withdrawalRequestId') withdrawalId: string,
    @Body() processWithdrawalDto: ProcessWithdrawalDto,
  ) {
    return this.withdrawalRequestService.processWithdrawal(
      withdrawalId,
      processWithdrawalDto,
    );
  }
}
