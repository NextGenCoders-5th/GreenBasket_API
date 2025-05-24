import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindProductsByCategoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findProductByCategory(categoryId: string) {
    let data;

    try {
      data = await this.prisma.category.findFirst({
        where: { id: categoryId },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              discount_price: true,
              unit: true,
              stock: true,
              image_url: true,
              status: true,
              is_featured: true,
              Vendor: true,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unabble to find products by category id.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find products by category successfull.',
      data,
    });
  }
}
