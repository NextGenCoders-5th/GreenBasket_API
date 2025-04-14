import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneCategoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneCategory(options: Partial<Category>) {}
}
