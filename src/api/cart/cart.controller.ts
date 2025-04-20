import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { ActiveUser, Role } from '../auth/decorators';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Get my cart',
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Get('my-cart')
  findMyCart(@ActiveUser('sub') userId: string) {
    return this.cartService.findMyCart(userId);
  }

  @ApiOperation({
    summary: 'Get all my carts',
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Get('my-carts')
  findMyCarts(@ActiveUser('sub') userId: string) {
    return this.cartService.findMyCarts(userId);
  }
}
