import { Injectable } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { CreateCartProvider } from './providers/create-cart.provider';
import { FindMyCartProvider } from './providers/find-my-cart.provider';
import { FindOneCartProvider } from './providers/find-one-cart.provider';
import { FindMyCartsProvider } from './providers/find-my-carts.provider';

@Injectable()
export class CartService {
  constructor(
    private readonly findOneCartProvider: FindOneCartProvider,
    private readonly createCartProvider: CreateCartProvider,
    private readonly findMyCartProvider: FindMyCartProvider,
    private readonly findMyCartsProvider: FindMyCartsProvider,
  ) {}
  createCart({ userId }: { userId: string }) {
    return this.createCartProvider.createCart({ userId });
  }

  findMyCart(userId: string) {
    return this.findMyCartProvider.findMyCart(userId);
  }

  findMyCarts(userId: string) {
    return this.findMyCartsProvider.findMyCarts(userId);
  }

  findOneCart(options: Partial<Cart>) {
    return this.findOneCartProvider.findOneCart(options);
  }
}
