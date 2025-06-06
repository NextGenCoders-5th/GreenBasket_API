import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneProductProvider } from './find-one-product.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { IDeleteProductById } from '../interfaces/delete-product-by-id.interface';

@Injectable()
export class DeleteProductByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneProductProvider: FindOneProductProvider,
  ) {}

  public async deleteProductById(options: IDeleteProductById) {
    // check if product exists
    const product = await this.findOneProductProvider.findOneProduct({
      id: options.productId,
      vendorId: options.vendorId,
    });

    if (!product) {
      throw new NotFoundException('product not found.');
    }

    try {
      await this.prisma.product.delete({ where: { id: options.productId } });
    } catch (err) {
      console.log('deleteProductById: ', err);
      throw new InternalServerErrorException(
        'Unable to delete product. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'product deleted successfully.',
      data: null,
    });
  }
}
