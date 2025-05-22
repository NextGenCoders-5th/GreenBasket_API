import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class VendorBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  // Get vendor balance
  async getVendorBalance(vendorId: string) {
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

    return balance;
  }

  // Initialize vendor balance (called when vendor is created)
  async initializeVendorBalance(vendorId: string) {
    try {
      const balance = await this.prisma.vendorBalance.create({
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
            type: 'ORDER_PAYMENT',
            status: 'COMPLETED',
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
