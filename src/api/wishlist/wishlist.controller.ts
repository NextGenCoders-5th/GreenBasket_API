import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ActiveUser } from '../auth/decorators';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // get my wishlists
  @ApiOperation({
    summary: 'get my wishlists.',
  })
  @ApiBearerAuth()
  @Get()
  getMyWishlists(@ActiveUser('sub') userId: string) {
    return this.wishlistService.getMyWishlists(userId);
  }

  // create wishlist
  @ApiOperation({
    summary: 'Create wishlist',
  })
  @ApiParam({
    name: 'id',
    description: 'product id to be added to wishlist',
    required: true,
  })
  @ApiBearerAuth()
  @Post(':id')
  createWishlist(
    @ActiveUser('sub') userId: string,
    @Param('id') productId: string,
  ) {
    return this.wishlistService.createWishlist({ productId, userId });
  }

  // delete wishlist
  @ApiOperation({
    summary: 'delete wishlist',
  })
  @ApiParam({
    name: 'id',
    description: 'wishlist id to be deleted.',
    required: true,
  })
  @ApiBearerAuth()
  @Delete(':id')
  deleteMyWishlist(@Param('id') wishlistId: string) {
    return this.wishlistService.deleteMyWishlist(wishlistId);
  }
}
