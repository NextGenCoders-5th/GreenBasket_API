import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindProductByIdProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async findProductById(id: string) {}
}
