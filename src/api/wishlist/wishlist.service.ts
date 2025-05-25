import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ICreateWishlist } from './interfaces/create-wishlist.interface';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  // get my wishlists
  public async getMyWishlists(userId: string) {
    try {
      const data = await this.prisma;
    } catch (err) {
      console.log(err);
    }
  }
  // create wishlist
  public async createWishlist(data: ICreateWishlist) {}
  // delete wishlist
  public async deleteMyWishlist(wishlistId: string) {}
}
