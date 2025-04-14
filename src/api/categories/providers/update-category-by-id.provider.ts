import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class UpdateCategoryByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async updateCategoryById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {}
}
