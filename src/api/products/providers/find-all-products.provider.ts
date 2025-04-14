import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllProductsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllProducts() {
    try {
      const products = await this.prisma.product.findMany();

      return CreateApiResponse({
        status: 'success',
        message: 'find all products successfull.',
        metadata: {},
        data: products,
      });
    } catch (err) {
      console.log('findAllProducts: ', err);
      throw new InternalServerErrorException(
        'Unable to find all products. please try again later.',
      );
    }
  }
}
