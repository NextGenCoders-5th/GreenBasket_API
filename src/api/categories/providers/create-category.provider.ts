import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async createCategory(createCategoryDto: CreateCategoryDto) {}
}
