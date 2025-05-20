import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { IBankInfo } from '../interfaces/supported-bank-info.interface';

@Injectable()
export class FindSupportedBankInfosProvider {
  private chapa_secret_key: string;
  constructor(private readonly configService: ConfigService) {
    this.chapa_secret_key = this.configService.get(
      'paymentConfig.chapaSecretKey',
    );
  }
  public async findSupportedBankInfos() {
    try {
      const response = await fetch('https://api.chapa.co/v1/banks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.chapa_secret_key}`,
          'Content-Type': 'application/json',
        },
      });

      const resBody = await response.json();
      if (resBody.status === 'failed') {
        throw new InternalServerErrorException(resBody.message);
      }

      const bankInfos: IBankInfo[] = resBody.data.map((bank) => {
        const bankInfo: IBankInfo = {
          bank_name: bank.name,
          bank_code: bank.id,
          bank_slug: bank.slug,
          acct_length: Number(bank.acct_length),
          currency: bank.currency,
          example_acc_num: '1000'.padEnd(
            Number(bank.acct_length),
            Math.random().toString().slice(14),
          ),
        };
        return bankInfo;
      });

      return CreateApiResponse({
        status: 'success',
        message: 'fetching supported bank infos is successfull.',
        data: bankInfos,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unable to find fetching supported bank infos.',
      );
    }
  }
}
