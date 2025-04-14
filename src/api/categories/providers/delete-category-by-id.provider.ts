import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { FindOneCategoryProvider } from './find-one-category.provider';

@Injectable()
export class DeleteCategoryByIdProvider {
  constructor(
    private readonly prisma: PrismaService,

    private readonly findOneCategoryProvider: FindOneCategoryProvider,
  ) {}

  public async deleteCategoryById(id: string) {
    const category = await this.findOneCategoryProvider.findOneCategory({ id });

    if (!category) {
      throw new NotFoundException('category not found.');
    }

    // delete category.
    try {
      await this.prisma.category.delete({ where: { id } });
    } catch (err) {
      console.log('deleteCategoryById: ', err);
      throw new InternalServerErrorException(
        'Unable to delete category. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'delete category by id successfull.',
      data: null,
    });
  }
}
