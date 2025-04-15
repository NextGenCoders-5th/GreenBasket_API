import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindCartItemByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findCartItemById(id: string) {
    return 'findCartItemById';
  }
}
