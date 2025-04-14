import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneCategoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneCategory(options: Partial<Category>) {
    try {
      const category = await this.prisma.category.findFirst({
        where: options,
      });

      return category;
    } catch (err) {
      console.log('findOneCategory: ', err);
      throw new InternalServerErrorException(
        'Unable to find one category. please try again later.',
      );
    }
  }
}
