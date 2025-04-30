import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ActiveUser, Role } from '../auth/decorators';
import { UserRole } from '@prisma/client';
import { IActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { IFindCartItemById } from './interfaces/find-cart-by-id.interface';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  // Create cart item
  @ApiOperation({
    summary: 'Create a new cart item',
  })
  @ApiBody({
    type: CreateCartItemDto,
    description: 'Create a new cart item',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Post()
  createCartItem(
    @Body() createCartItemDto: CreateCartItemDto,
    @ActiveUser('sub') userId: string,
  ) {
    createCartItemDto.userId = userId;
    return this.cartItemsService.createCartItem(createCartItemDto);
  }

  // Find all cart items for a user
  @ApiOperation({
    summary: 'Find all cart items for a user',
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Get('/user')
  findUserCartItems(@ActiveUser('sub') userId: string) {
    return this.cartItemsService.findUserCartItems(userId);
  }

  // Find all cart items
  @ApiOperation({
    summary: 'Find all cart items',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get()
  findAllCartItems() {
    return this.cartItemsService.findAllCartItems();
  }

  // Find cart item by id
  @ApiOperation({
    summary: 'Find a cart item by id',
  })
  @ApiParam({
    name: 'id',
    description: 'cart item id',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER, UserRole.ADMIN)
  @Get(':id')
  findCartItemById(
    @Param('id') id: string,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    const condition: IFindCartItemById = {
      cartItemId: id,
    };
    if (activeUserData.role === UserRole.CUSTOMER) {
      condition.userId = activeUserData.sub;
    }
    return this.cartItemsService.findCartItemById(condition);
  }

  // Update cart item by id
  @ApiOperation({
    summary: 'Update a cart item by id',
  })
  @ApiBody({
    type: UpdateCartItemDto,
    description: 'Update a cart item by id',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'cart item id',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER, UserRole.ADMIN)
  @Patch(':id')
  updateCartItemById(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    if (activeUserData.role === UserRole.CUSTOMER) {
      updateCartItemDto.userId = activeUserData.sub;
    }

    return this.cartItemsService.updateCartItemById(id, updateCartItemDto);
  }

  // Delete cart item by id
  @ApiOperation({
    summary: 'Delete a cart item by id',
  })
  @ApiParam({
    name: 'id',
    description: 'cart item id',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCartItemById(
    @Param('id') id: string,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    const condition: IFindCartItemById = {
      cartItemId: id,
    };
    if (activeUserData.role === UserRole.CUSTOMER) {
      condition.userId = activeUserData.sub;
    }
    return this.cartItemsService.deleteCartItemById(condition);
  }
}
