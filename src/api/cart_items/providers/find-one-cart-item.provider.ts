import { Injectable } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FindOneCartItemProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneCartItem(options: Partial<CartItem>) {
    return 'findOneCartItem';
  }
}
