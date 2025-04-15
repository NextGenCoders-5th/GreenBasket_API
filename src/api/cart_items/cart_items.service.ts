import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import {
  CreateCartItemProvider,
  DeleteCartItemByIdProvider,
  FindAllCartItemsProvider,
  FindCartItemByIdProvider,
  FindOneCartItemProvider,
  UpdateCartItemByIdProvider,
} from './providers';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartItemsService {
  constructor(
    private readonly createCartItemProvider: CreateCartItemProvider,
    private readonly deleteCartItemByIdProvider: DeleteCartItemByIdProvider,
    private readonly findAllCartItemsProvider: FindAllCartItemsProvider,
    private readonly findCartItemByIdProvider: FindCartItemByIdProvider,
    private readonly findOneCartItemProvider: FindOneCartItemProvider,
    private readonly updateCartItemByIdProvider: UpdateCartItemByIdProvider,
  ) {}

  createCartItem(createCartItemDto: CreateCartItemDto) {
    return this.createCartItemProvider.createCartItem(createCartItemDto);
  }

  findAllCartItems() {
    return this.findAllCartItemsProvider.findAllCartItems();
  }

  findCartItemById(id: string) {
    return this.findCartItemByIdProvider.findCartItemById(id);
  }

  updateCartItemById(id: string, updateCartItemDto: UpdateCartItemDto) {
    return this.updateCartItemByIdProvider.updateCartItemById(
      id,
      updateCartItemDto,
    );
  }

  deleteCartItemById(id: string) {
    return this.deleteCartItemByIdProvider.deleteCartItemById(id);
  }

  findOneCartItem(options: Partial<CartItem>) {
    return this.findOneCartItemProvider.findOneCartItem(options);
  }
}
