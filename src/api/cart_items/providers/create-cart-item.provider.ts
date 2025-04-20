import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { CartService } from 'src/api/cart/cart.service';
import { ProductsService } from 'src/api/products/products.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateCartItemDto } from '../dto/create-cart_item.dto';
import { FindOneCartItemProvider } from './find-one-cart-item.provider';

@Injectable()
export class CreateCartItemProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly findOneCartItemProvider: FindOneCartItemProvider,
  ) {}

  public async createCartItem(createCartItemDto: CreateCartItemDto) {
    const { productId, quantity, userId } = createCartItemDto;
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
    // check if that product is already added to the cart if so update the quantity
    cartItem = await this.findOneCartItemProvider.findOneCartItem({
      productId,
      cartId: cart.id,
    });

    try {
      // start transaction
      await this.prisma.$transaction(async (tx) => {
        if (!cartItem) {
          // else create a new cart item
          cartItem = await tx.cartItem.create({
            data: {
              price: product.price,
              quantity,
              sub_total: product.price.mul(quantity),
              cartId: cart.id,
              productId: product.id,
            },
          });
        } else {
          cartItem = await tx.cartItem.update({
            where: { id: cartItem.id },
            data: {
              quantity: cartItem.quantity.add(quantity),
              sub_total: cartItem.sub_total.add(product.price.mul(quantity)),
            },
          });
        }
        // update cart total
        await tx.cart.update({
          where: { id: cart.id },
          data: {
            total_price: cart.total_price.add(cartItem.sub_total),
          },
        });
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
