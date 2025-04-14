import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FindOneCategoryProvider } from './find-one-category.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateCategoryByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneCategoryProvider: FindOneCategoryProvider,
  ) {}

  public async updateCategoryById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const { name, image_url } = updateCategoryDto;
    // check if category exists
    let category = await this.findOneCategoryProvider.findOneCategory({ id });
    if (!category) {
      throw new NotFoundException('category not found.');
    }

    // check if name changed, check the slug
    try {
      updateCategoryDto.slug = slugify(name, '_');
      category = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          NOT: { id },
        },
      });
    } catch (err) {
      console.log('UpdateCategoryByIdProvider: ', err);
      throw new InternalServerErrorException('');
    }

    if (category) {
      throw new InternalServerErrorException(
        'Category with the same name or slug already exists. please update the name of the category.',
      );
    }

    // update category
    try {
      category = await this.prisma.category.update({
        where: { id },
        data: {
          name: name ?? category.name,
          slug: updateCategoryDto.slug ?? category.slug,
          image_url: image_url ?? category.image_url,
        },
      });
    } catch (err) {
      console.log('UpdateCategoryByIdProvider: ', err);
    }

    return CreateApiResponse({
      status: 'success',
      message: 'update category by id successfull.',
      data: category,
    });
  }
}
