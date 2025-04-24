import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { GetProductsDto } from '../dto/get-products.dto';

@Injectable()
export class FindAllProductsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllProducts(query: GetProductsDto) {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      });

      const totalItems = await this.prisma.product.count();
      const totalPages = Math.ceil(totalItems / query.limit);

      return CreateApiResponse({
        status: 'success',
        message: 'find all products successfull.',
        metadata: {
          currentPage: query.page,
          itemsPerPage: query.limit,
          totalItems,
          totalPages,
        },
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
