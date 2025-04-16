import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneCartProvider } from './find-one-cart.provider';

@Injectable()
export class CreateCartProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneCartProvider: FindOneCartProvider,
  ) {}

  public async createCart({ userId }: { userId: string }) {
    let cart = await this.findOneCartProvider.findOneCart({
      userId,
    });

    if (cart) return cart;

    try {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
      });
      return cart;
    } catch (err) {
      console.log('create-cart: ', err);
      throw new InternalServerErrorException(
        'Unable to create a cart, please try again later.',
      );
    }
  }
}
