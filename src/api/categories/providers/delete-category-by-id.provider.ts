import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class DeleteCategoryByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async deleteCategoryById(id: string) {}
}
