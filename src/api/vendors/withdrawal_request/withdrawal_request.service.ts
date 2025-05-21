import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Vendor,
  VendorBalance,
  WithdrawalRequest,
  WithdrawalStatus,
} from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateWithdrawalRequestDto } from './dtos/create-withdrawal-request.dto';
import { ProcessWithdrawalDto } from './dtos/process-withdrawal.dto';

@Injectable()
export class WithdrawalRequestService {
  constructor(private readonly prisma: PrismaService) {}

  // Create withdrawal request
  async createWithdrawalRequest(
    createWithdrawalRequestDto: CreateWithdrawalRequestDto,
  ) {
    const { amount, notes, userId } = createWithdrawalRequestDto;

    if (!userId) {
      throw new BadRequestException('user id is required.');
    }

    let vendor: Vendor;
    try {
      vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find vendor, please try again later.',
      );
    }

    if (!vendor) {
      throw new NotFoundException('vendor not found.');
    }

    // First check vendor balance
    let vendorBalance: VendorBalance;
    try {
      vendorBalance = await this.prisma.vendorBalance.findUnique({
        where: { vendorId: vendor.id },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find vendor balance. please try again later.',
      );
    }

    if (!vendorBalance || vendorBalance.available_balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance for withdrawal');
    }

    try {
      // Create withdrawal request in a transaction
      const request = await this.prisma.$transaction(async (tx) => {
        // Update vendor balance
        await tx.vendorBalance.update({
          where: { vendorId: vendor.id },
          data: {
            available_balance: { decrement: amount },
            pending_withdrawals: { increment: amount },
          },
        });

        // Create withdrawal request
        return tx.withdrawalRequest.create({
          data: {
            amount,
            notes,
            vendor_balance: { connect: { vendorId: vendor.id } },
          },
        });
      });

      return CreateApiResponse({
        status: 'success',
        message: 'withdrawal request successfull.',
        data: request,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to create withdrawal request at the momet, please try again later.',
      );
    }
  }

  // Get vendor's withdrawal requests
  async getVendorWithdrawals(vendorId: string) {
    try {
      const requests = this.prisma.withdrawalRequest.findMany({
        where: {
          vendor_balance: {
            vendorId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'get vendors withdrawal requests successfull.',
        data: requests,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find withdrawal requests. please try again later.',
      );
    }
  }

  // Admin: Process withdrawal request
  async processWithdrawal(
    withdrawalId: string,
    processWithdrawalDto: ProcessWithdrawalDto,
  ) {
    const { status } = processWithdrawalDto;
    let withdrawal: WithdrawalRequest;
    try {
      withdrawal = await this.prisma.withdrawalRequest.findUnique({
        where: { id: withdrawalId },
        include: { vendor_balance: true },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'unable to find withdrawalRequest. please try again later.',
      );
    }

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        if (status === WithdrawalStatus.COMPLETED) {
          await tx.vendorBalance.update({
            where: { id: withdrawal.vendor_balance_id },
            data: {
              pending_withdrawals: { decrement: withdrawal.amount },
              withdrawn_amount: { increment: withdrawal.amount },
            },
          });
        } else if (status === WithdrawalStatus.REJECTED) {
          await tx.vendorBalance.update({
            where: { id: withdrawal.vendor_balance_id },
            data: {
              pending_withdrawals: { decrement: withdrawal.amount },
              available_balance: { increment: withdrawal.amount },
            },
          });
        }

        return tx.withdrawalRequest.update({
          where: { id: withdrawalId },
          data: {
            status,
            processed_at: new Date(),
          },
        });
      });

      return CreateApiResponse({
        status: 'success',
        message: 'withdrawal processing successfull.',
        data: result,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to process withdrawal request, please try again later.',
      );
    }
  }
}
