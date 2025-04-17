import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCartItemDto } from '../dto/create-cart_item.dto';
import { ProductsService } from 'src/api/products/products.service';
import { CartService } from 'src/api/cart/cart.service';
import { CartItem } from '@prisma/client';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class CreateCartItemProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
  ) {}

  public async createCartItem(createCartItemDto: CreateCartItemDto) {
    const { price, productId, quantity, userId } = createCartItemDto;
    // check if product id exists
    const product = await this.productsService.findOneProduct({
      id: productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    // check if cart is created if not create one else find and attach it to the cart item.
    const cart = await this.cartService.createCart({ userId });
    if (!cart) {
      throw new InternalServerErrorException(
        'Unable to find cart for the user',
      );
    }
    // create cart item
    let cartItem: CartItem | undefined;
    try {
      cartItem = await this.prisma.cartItem.create({
        data: {
          price,
          quantity,
          sub_total: Number((price * quantity).toFixed(2)),
          cartId: cart.id,
          productId: product.id,
        },
      });
      // update cart total
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          total_price: cart.total_price.add(cartItem.sub_total),
        },
      });
    } catch (err) {
      console.log('createCartItem: ', err);
      throw new InternalServerErrorException(
        'Unable to create cart item. please try again later.',
      );
    }
    // return response
    return CreateApiResponse({
      status: 'success',
      message: 'create cart item successfull.',
      data: cartItem,
    });
  }
}
