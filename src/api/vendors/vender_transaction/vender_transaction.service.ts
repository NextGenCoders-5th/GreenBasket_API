import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class VenderTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  // get all transactions
  public async getAllTransactions() {
    try {
      const transactions = await this.prisma.vendorTransaction.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'get all transactions successfull',
        data: transactions,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to fetch transactions. please try again later.',
      );
    }
  }

  // get vendor transaction
  public async getVendorTransactions(vendorId: string) {
    if (!vendorId) {
      throw new BadRequestException('vendorId is required');
    }

    try {
      const transactions = await this.prisma.vendorTransaction.findMany({
        where: {
          vendor_balance: {
            vendorId,
          },
        },
      });
      return CreateApiResponse({
        status: 'success',
        message: 'get vendor transactions successfull.',
        data: transactions,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to fetch vendor transactions. please try again later.',
      );
    }
  }
}
