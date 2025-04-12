import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class DeleteProductByIdProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async deleteProductById(id: string) {}
}
