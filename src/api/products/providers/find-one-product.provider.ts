import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneProductProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async findOneProduct(options: Partial<Product>) {}
}
