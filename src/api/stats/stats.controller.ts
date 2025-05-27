import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ActiveUser, Role } from '../auth/decorators';
import { UserRole, Vendor } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly prisma: PrismaService,
  ) {}
  @ApiOperation({
    summary: 'get dashboard stats',
  })
  @Role(UserRole.VENDOR, UserRole.ADMIN)
  @ApiQuery({
    name: 'vendorId',
    description:
      'admins can send vendor id on the query and geet details about that vendor.',
    required: false,
  })
  @ApiBearerAuth()
  @Get()
  public async dashboardStats(
    @ActiveUser() activeUserData: IActiveUserData,
    @Query('vendorId') vendorId: string,
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
    return this.statsService.dashboardStats(vendor.id);
  }
}
