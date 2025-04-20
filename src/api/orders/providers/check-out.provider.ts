import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CartStatus, Order, OrderStatus, Prisma } from '@prisma/client';
import { AddressesService } from 'src/api/addresses/addresses.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CheckOutDto } from '../dtos/checkout.dto';

@Injectable()
export class CheckOutProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly addressesService: AddressesService,
  ) {}

  public async checkOut(checOutDto: CheckOutDto) {
    const { cartId, userId, addressId } = checOutDto;
    // fetch cart and cart item
    let cart: Prisma.CartGetPayload<{
      include: { CartItems: { include: { Product: true } } };
    }>;

    try {
      cart = await this.prisma.cart.findFirst({
        where: {
          id: cartId,
          userId,
          status: CartStatus.ACTIVE,
        },
        include: {
          CartItems: {
            include: {
              Product: true,
            },
          },
        },
      });
    } catch (err) {
      console.log('check out', err);
      throw new InternalServerErrorException(
        'Unable to fetch cart. please try again later.',
      );
    }
    // check if cart is empty
    if (!cart || !cart.CartItems.length) {
      throw new NotFoundException('Cart not found or empty.');
    }

    // check if address is valid
    const address = await this.addressesService.findOneAddress({
      id: addressId,
    });
    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    // Double Checkout Prevention
    let existingOrder: Order;
    try {
      existingOrder = await this.prisma.order.findFirst({
        where: {
          cartId,
          userId,
          status: {
            in: [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.SHIPPED,
              OrderStatus.DELIVERED,
            ],
          },
        },
      });
    } catch (err) {
      console.log('check out', err);
      throw new InternalServerErrorException(
        'Unable to fetch order. please try again later.',
      );
    }

    if (existingOrder) {
      throw new BadRequestException(
        'An order has already been placed for this cart.',
      );
    }

    // stock validation
    const outOfStack: string[] = [];
    for (const item of cart.CartItems) {
      if (item.Product.stock.toNumber() < item.quantity.toNumber()) {
        outOfStack.push(item.Product.name);
      }
    }

    if (outOfStack.length) {
      throw new NotFoundException(
        `The following items are out of stock: ${outOfStack.join(', ')}`,
      );
    }

    // calculate total price
    const totalPrice = cart.CartItems.reduce((acc, item) => {
      return acc + item.sub_total.toNumber();
    }, 0);

    try {
      // Create an order and order items
      const order = await this.prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            total_price: totalPrice,
            addressId,
            userId,
            cartId,
            OrderItems: {
              create: cart.CartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                sub_total: item.sub_total,
              })),
            },
          },
          include: {
            Adress: true,
            OrderItems: true,
          },
        });

        // update cart status to CHECKED_OUT
        await tx.cart.update({
          where: { id: cartId },
          data: { status: CartStatus.CHECKED_OUT },
        });

        // update product stock
        await Promise.all(
          cart.CartItems.map(async (item) => {
            return await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }),
        );

        return createdOrder;
      });

      // return response
      return CreateApiResponse({
        status: 'success',
        message: 'Order created successfully.',
        data: order,
      });
    } catch (err) {
      console.log('check out', err);
      throw new InternalServerErrorException(
        'Unable to create order. please try again later.',
      );
    }
  }
}
