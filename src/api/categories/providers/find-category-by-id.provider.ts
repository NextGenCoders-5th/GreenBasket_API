import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindCategoryByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findCategoryById(id: string) {}
}
