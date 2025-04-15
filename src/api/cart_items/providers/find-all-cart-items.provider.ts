import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindAllCartItemsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllCartItems() {
    return 'findAllCartItems';
  }
}
