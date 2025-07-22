import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class VendorBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  // Get vendor balance
  async getVendorBalance(vendorId: string) {
    try {
      const balance = await this.prisma.vendorBalance.findUnique({
        where: { vendorId },
        include: {
          withdrawal_requests: {
            where: { status: 'PENDING' },
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          transactions: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!balance) {
        throw new NotFoundException('Vendor balance not found');
      }

      return CreateApiResponse({
        status: 'success',
        message: 'getVendorBalance successfull',
        data: balance,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find vendor balance. please try again later.',
      );
    }
  }

  // Initialize vendor balance (called when vendor is created)
  async initializeVendorBalance(vendorId: string, tx?: any) {
    try {
      // Use the passed transaction or fallback to this.prisma
      const prisma = tx || this.prisma;

      const existingBalance = await prisma.vendorBalance.findUnique({
        where: { vendorId },
      });

      if (existingBalance) {
        return CreateApiResponse({
          status: 'success',
          message: 'Vendor has a balance initialized already.',
          data: existingBalance,
        });
      }

      const balance = await prisma.vendorBalance.create({
        data: {
          vendor: { connect: { id: vendorId } },
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Initialize vendor balance successfull.',
        data: balance,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to  Initialize vendor balance. please try again later.',
      );
    }
  }

  // Update balance after order completion
  async updateBalanceAfterOrder(vendorId: string, amount: number) {
    console.log('vendor balance after order...');
    try {
      const updatedBalance = await this.prisma.$transaction(async (tx) => {
        // Update balance
        const updatedBalance = await tx.vendorBalance.update({
          where: { vendorId },
          data: {
            total_earnings: { increment: amount },
            available_balance: { increment: amount },
          },
        });

        // Create transaction record
        await tx.vendorTransaction.create({
          data: {
            amount,
            type: TransactionType.ORDER_PAYMENT,
            status: TransactionStatus.COMPLETED,
            vendor_balance: { connect: { id: updatedBalance.id } },
          },
        });

        return updatedBalance;
      });

      return CreateApiResponse({
        status: 'success',
        message: 'balance updated successfully.',
        data: updatedBalance,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to update balance. please try again later.',
      );
    }
  }
}
