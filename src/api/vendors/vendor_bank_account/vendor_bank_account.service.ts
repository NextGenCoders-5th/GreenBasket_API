import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBankAccountDto } from './dtos/create-back-account.dto';
import { VendorBankAccount } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';

@Injectable()
export class VendorBankAccountService {
  constructor(private readonly prisma: PrismaService) {}

  public async createBankAccount(createBankAccountDto: CreateBankAccountDto) {
    const { account_name, account_number, bank_name, vendorId } =
      createBankAccountDto;

    if (!vendorId) {
      throw new BadRequestException('vendor id is required.');
    }

    let account: VendorBankAccount;
    try {
      account = await this.prisma.vendorBankAccount.findUnique({
        where: { vendorId },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find vendor bacnk account. please try again later.',
      );
    }
    if (account) {
      return CreateApiResponse({
        status: 'success',
        message: 'vendor already registered a bank account number.',
        data: account,
      });
    }

    try {
      account = await this.prisma.vendorBankAccount.create({
        data: {
          account_name,
          account_number,
          bank_name,
          vendorId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to create account number. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'vendor bank account created successfully.',
      data: account,
    });
  }

  public async updateBankAccount(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { account_name, account_number, bank_name, vendorId } =
      updateBankAccountDto;

    if (!vendorId) {
      throw new BadRequestException('vendor id is required.');
    }

    let account: VendorBankAccount;
    try {
      account = await this.prisma.vendorBankAccount.findUnique({
        where: { id, vendorId },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find vendor bacnk account. please try again later.',
      );
    }

    if (!account) {
      throw new NotFoundException('No bank account number is found.');
    }

    try {
      account = await this.prisma.vendorBankAccount.update({
        where: { id, vendorId },
        data: {
          account_name: account_name ?? account.account_name,
          account_number: account_number ?? account.account_number,
          bank_name: bank_name ?? account.bank_name,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to update bank account. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'bank account number updated successfully.',
      data: account,
    });
  }
}
