import { Injectable } from '@nestjs/common';
import { UpdateCartItemDto } from '../dto/update-cart_item.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UpdateCartItemByIdProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async updateCartItemById(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    return 'updateCartItemById';
  }
}
