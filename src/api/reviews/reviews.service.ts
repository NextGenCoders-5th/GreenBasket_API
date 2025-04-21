import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  public async createReview(createReviewDto: CreateReviewDto) {
    const { orderItemId, rating, userId, comment } = createReviewDto;

    let orderItem: Prisma.OrderItemGetPayload<{
      include: { Review: true; Order: true };
    }>;
    try {
      orderItem = await this.prisma.orderItem.findUnique({
        where: {
          id: orderItemId,
        },
        include: { Review: true, Order: true },
      });
    } catch (err) {
      console.log('createReview: ', err);
      throw new InternalServerErrorException(
        'Unable to find order item, please try again',
      );
    }

    if (!orderItem || orderItem.Order.userId !== userId) {
      throw new NotFoundException('Order item not found or not yours');
    }

    if (orderItem.Review || orderItem.reviewed) {
      throw new BadRequestException('You already reviewed this product');
    }

    try {
      const [review] = await this.prisma.$transaction([
        this.prisma.review.create({
          data: {
            rating,
            comment,
            userId,
            orderItemId,
          },
        }),
        this.prisma.orderItem.update({
          where: { id: orderItemId },
          data: { reviewed: true },
        }),
      ]);

      return CreateApiResponse({
        status: 'success',
        message: 'Review created successfully',
        data: review,
      });
    } catch (err) {
      console.log('createReview: ', err);
      throw new InternalServerErrorException(
        'Unable to create review, please try again',
      );
    }
  }

  public async findMyReviews(userId: string) {
    let reviews: Review[];
    try {
      reviews = await this.prisma.review.findMany({
        where: { userId },
        include: { OrderItem: true },
      });
    } catch (err) {
      console.error('[ReviewService:getMyReviews]', err);
      throw new InternalServerErrorException('Could not fetch reviews');
    }

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException('No reviews found');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Reviews fetched successfully',
      data: reviews,
    });
  }

  public async findReviewById(id: string) {
    let review: Review;
    try {
      review = await this.prisma.review.findUnique({
        where: { id },
        include: { OrderItem: { include: { Product: true } } },
      });
    } catch (err) {
      console.error('[ReviewService:getMyReviews]', err);
      throw new InternalServerErrorException('Could not fetch review');
    }

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Review fetched successfully',
      data: review,
    });
  }

  public async findReviewsByProductId(productId: string) {
    let reviews: Review[];
    try {
      reviews = await this.prisma.review.findMany({
        where: { OrderItem: { productId } },
        include: { OrderItem: { include: { Product: true } } },
      });
    } catch (err) {
      console.error('[ReviewService:getMyReviews]', err);
      throw new InternalServerErrorException('Could not fetch reviews');
    }

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException('No reviews found');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Reviews fetched successfully',
      data: reviews,
    });
  }

  public async updateMyReview(id: string, updateReviewDto: UpdateReviewDto) {
    const { comment, rating, userId } = updateReviewDto;

    let review: Review;
    try {
      review = await this.prisma.review.findUnique({
        where: { id },
      });
    } catch (err) {
      console.error('[ReviewService:updateReview]', err);
      throw new InternalServerErrorException('Could not fetch review');
    }

    if (!review || review.userId !== userId) {
      throw new NotFoundException('Review not found or not yours');
    }

    try {
      const updatedReview = await this.prisma.review.update({
        where: { id },
        data: {
          comment,
          rating,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Review updated successfully',
        data: updatedReview,
      });
    } catch (err) {
      console.error('[ReviewService:updateReview]', err);
      throw new InternalServerErrorException('Could not update review');
    }
  }

  public async deleteMyReview(reviewId: string, userId: string) {
    let review: Review;
    try {
      review = await this.prisma.review.findUnique({
        where: { id: reviewId },
      });
    } catch (err) {
      console.error('[ReviewService:updateReview]', err);
      throw new InternalServerErrorException('Could not fetch review');
    }

    if (!review || review.userId !== userId) {
      throw new NotFoundException('Review not found or not yours');
    }

    try {
      await this.prisma.review.delete({
        where: { id: reviewId },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Review deleted successfully',
      });
    } catch (err) {
      console.error('[ReviewService:updateReview]', err);
      throw new InternalServerErrorException('Could not delete review');
    }
  }

  public async deleteReview(reviewId: string) {
    let review: Review;
    try {
      review = await this.prisma.review.findUnique({
        where: { id: reviewId },
      });
    } catch (err) {
      console.error('[ReviewService:updateReview]', err);
      throw new InternalServerErrorException('Could not fetch review');
    }

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    try {
      await this.prisma.review.delete({
        where: { id: reviewId },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'Review deleted successfully',
      });
    } catch (err) {
      console.error('[ReviewService:updateReview]', err);
      throw new InternalServerErrorException('Could not delete review');
    }
  }
}
