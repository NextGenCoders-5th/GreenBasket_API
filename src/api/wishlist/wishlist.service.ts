import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ICreateWishlist } from './interfaces/create-wishlist.interface';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  // Get current user's wishlists
  public async getMyWishlists(userId: string) {
    try {
      return await this.prisma.wishlist.findMany({
        where: { userId },
        include: {
          Product: true,
        },
      });
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      throw new InternalServerErrorException('Failed to retrieve wishlists');
    }
  }

  // Add product to wishlist
  public async createWishlist({ productId, userId }: ICreateWishlist) {
    try {
      return await this.prisma.wishlist.create({
        data: { productId, userId },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException('Product already exists in wishlist');
      }
      console.error('Error creating wishlist:', error);
      throw new InternalServerErrorException('Failed to create wishlist');
    }
  }

  // Remove wishlist item by ID
  public async deleteMyWishlist(wishlistId: string) {
    try {
      const wishlist = await this.prisma.wishlist.findUnique({
        where: { id: wishlistId },
      });

      if (!wishlist) {
        throw new NotFoundException('Wishlist not found');
      }

      return await this.prisma.wishlist.delete({
        where: { id: wishlistId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting wishlist:', error);
      throw new InternalServerErrorException('Failed to delete wishlist');
    }
  }
}
