import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneAddressProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneAdress(option: Partial<Address>) {
    try {
      const address = await this.prisma.address.findFirst({
        where: option,
      });
      return address;
    } catch (err) {
      console.log('find one address: ', err);
      throw new InternalServerErrorException(
        'Unable to fetch address, please try again later.',
      );
    }
  }
}
