import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneProductProvider } from './find-one-product.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindProductByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneProductProvider: FindOneProductProvider,
  ) {}
  public async findProductById(id: string) {
    // check if product exists
    const product = await this.findOneProductProvider.findOneProduct({ id });

    if (!product) {
      throw new NotFoundException('product not found.');
    }

    // return response
    return CreateApiResponse({
      status: 'success',
      message: 'find product by id successfull',
      data: product,
    });
  }
}
