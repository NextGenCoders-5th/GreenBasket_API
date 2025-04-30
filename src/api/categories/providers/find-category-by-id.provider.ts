import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class FindCategoryByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findCategoryById(id: string) {
    let category: Category | undefined;
    try {
      // check if category exists
      category = await this.prisma.category.findFirst({
        where: {
          id,
        },
      });
    } catch (err) {
      console.log('findCategoryById: ', err);
      throw new InternalServerErrorException(
        'Unable to find category by id. please try again later.',
      );
    }

    if (!category) {
      throw new NotFoundException('category not found.');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'find category by id successfull.',
      data: category,
    });
  }
}
