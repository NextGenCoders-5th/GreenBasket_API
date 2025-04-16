import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from '@prisma/client';
import { FindOneCartProvider } from './providers/find-one-cart.provider';
import { CreateCartProvider } from './providers/create-cart.provider';

@Injectable()
export class CartService {
  constructor(
    private readonly findOneCartProvider: FindOneCartProvider,
    private readonly createCartProvider: CreateCartProvider,
  ) {}
  createCart({ userId }: { userId: string }) {
    return this.createCartProvider.createCart({ userId });
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  findOneCart(options: Partial<Cart>) {
    return this.findOneCartProvider.findOneCart(options);
  }
}
