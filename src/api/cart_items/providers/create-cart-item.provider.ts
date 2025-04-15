import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCartItemDto } from '../dto/create-cart_item.dto';

@Injectable()
export class CreateCartItemProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async createCartItem(createCartItemDto: CreateCartItemDto) {
    return 'This action adds a new cartItem';
  }
}
