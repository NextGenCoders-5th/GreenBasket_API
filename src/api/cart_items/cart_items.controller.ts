import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  createCartItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.createCartItem(createCartItemDto);
  }

  @Get()
  findAllCartItems() {
    return this.cartItemsService.findAllCartItems();
  }

  @Get(':id')
  findCartItemById(@Param('id') id: string) {
    return this.cartItemsService.findCartItemById(id);
  }

  @Patch(':id')
  updateCartItemById(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.updateCartItemById(id, updateCartItemDto);
  }

  @Delete(':id')
  deleteCartItemById(@Param('id') id: string) {
    return this.cartItemsService.deleteCartItemById(id);
  }
}
