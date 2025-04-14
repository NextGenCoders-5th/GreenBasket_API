import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneProductProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneProduct(options: Partial<Product>) {
    try {
      const product = await this.prisma.product.findFirst({ where: options });
      return product;
    } catch (err) {
      console.log('findOneProduct: ', err);
      throw new InternalServerErrorException(
        'Unable to find one products. please try again later.',
      );
    }
  }
}
