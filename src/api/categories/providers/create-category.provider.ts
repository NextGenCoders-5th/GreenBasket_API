import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async createCategory(createCategoryDto: CreateCategoryDto) {
    // check if slug already exists
    let category: Category | undefined;
    const { name, image_url } = createCategoryDto;

    try {
      createCategoryDto.slug = slugify(name, '_');
      category = await this.prisma.category.findFirst({
        where: { slug: createCategoryDto.slug },
      });
    } catch (err) {
      console.log('createCategory: ', err);
      throw new InternalServerErrorException(
        'Unable to find one category. please try again later.',
      );
    }

    if (category) {
      throw new BadRequestException(
        'Category with the same name or slug already exists. please update the name of the category.',
      );
    }
    // create category
    try {
      category = await this.prisma.category.create({
        data: {
          name,
          image_url,
          slug: createCategoryDto.slug,
        },
      });
    } catch (err) {
      console.log('createCategory: ', err);
      throw new InternalServerErrorException(
        'Unable to create category. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'create category successfull.',
      data: category,
    });
  }
}
