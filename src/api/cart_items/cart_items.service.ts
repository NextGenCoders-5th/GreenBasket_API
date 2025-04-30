import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import {
  CreateCartItemProvider,
  DeleteCartItemByIdProvider,
  FindAllCartItemsProvider,
  FindCartItemByIdProvider,
  FindOneCartItemProvider,
  FindUserCartItemsProvider,
  UpdateCartItemByIdProvider,
} from './providers';
import { CartItem } from '@prisma/client';
import { IFindCartItemById } from './interfaces/find-cart-by-id.interface';
import { IDeleteCartItemById } from './interfaces/delete-cart-item-by-id.interface';

@Injectable()
export class CartItemsService {
  constructor(
    private readonly createCartItemProvider: CreateCartItemProvider,
    private readonly deleteCartItemByIdProvider: DeleteCartItemByIdProvider,
    private readonly findAllCartItemsProvider: FindAllCartItemsProvider,
    private readonly findCartItemByIdProvider: FindCartItemByIdProvider,
    private readonly findOneCartItemProvider: FindOneCartItemProvider,
    private readonly updateCartItemByIdProvider: UpdateCartItemByIdProvider,
    private readonly findUserCartItemsProvider: FindUserCartItemsProvider,
  ) {}

  createCartItem(createCartItemDto: CreateCartItemDto) {
    return this.createCartItemProvider.createCartItem(createCartItemDto);
  }

  findAllCartItems() {
    return this.findAllCartItemsProvider.findAllCartItems();
  }

  findUserCartItems(userId: string) {
    return this.findUserCartItemsProvider.findUserCartItems(userId);
  }

  findCartItemById(data: IFindCartItemById) {
    return this.findCartItemByIdProvider.findCartItemById(data);
  }

  updateCartItemById(id: string, updateCartItemDto: UpdateCartItemDto) {
    return this.updateCartItemByIdProvider.updateCartItemById(
      id,
      updateCartItemDto,
    );
  }

  deleteCartItemById(data: IDeleteCartItemById) {
    return this.deleteCartItemByIdProvider.deleteCartItemById(data);
  }

  findOneCartItem(options: Partial<CartItem>) {
    return this.findOneCartItemProvider.findOneCartItem(options);
  }
}
