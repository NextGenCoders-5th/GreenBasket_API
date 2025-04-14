import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindAllCategoriesProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllCategories() {
    let categories: Category[] | undefined;

    try {
      categories = await this.prisma.category.findMany();
    } catch (err) {
      console.log('findAllCategories: ', err);
      throw new InternalServerErrorException(
        'Unable to all find categories. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find all categories successfull.',
      metadata: {},
      data: categories,
    });
  }
}
