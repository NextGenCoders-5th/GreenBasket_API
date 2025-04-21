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
      include: {
        CartItems: { include: { Product: { include: { Vendor: true } } } };
      };
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
              Product: {
                include: {
                  Vendor: true,
                },
              },
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
      if (item.Product.stock < item.quantity) {
        outOfStack.push(item.Product.name);
      }
    }

    if (outOfStack.length) {
      throw new NotFoundException(
        `The following items are out of stock: ${outOfStack.join(', ')}`,
      );
    }

    try {
      const createdOrders = await this.prisma.$transaction(async (tx) => {
        const groupedByVendor = cart.CartItems.reduce(
          (acc, item) => {
            const vendorId = item.Product.vendorId;
            if (!acc[vendorId]) acc[vendorId] = [];
            acc[vendorId].push(item);
            return acc;
          },
          {} as Record<string, typeof cart.CartItems>,
        );

        const orders = await Promise.all(
          Object.entries(groupedByVendor).map(async ([vendorId, items]) => {
            const vendorTotalPrice = items.reduce((acc, item) => {
              return acc + item.sub_total.toNumber();
            }, 0);

            // create order for each vendor
            const createdOrder = await tx.order.create({
              data: {
                total_price: vendorTotalPrice,
                addressId,
                userId,
                cartId,
                vendorId,
                OrderItems: {
                  create: items.map((item) => ({
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

            // Update product stock in parallel
            await Promise.all(
              items.map(async (item) => {
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
          }),
        );

        // Update cart status
        await tx.cart.update({
          where: { id: cartId },
          data: { status: CartStatus.CHECKED_OUT },
        });

        return orders;
      });

      // return response
      return CreateApiResponse({
        status: 'success',
        message: 'Order created successfully.',
        data: createdOrders,
      });
    } catch (err) {
      console.log('check out', err);
      throw new InternalServerErrorException(
        'Unable to create order. please try again later.',
      );
    }
  }
}
