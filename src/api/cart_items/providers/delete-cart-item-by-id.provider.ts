import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class DeleteCartItemByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async deleteCartItemById(id: string) {
    return 'deleteCartItemById';
  }
}
