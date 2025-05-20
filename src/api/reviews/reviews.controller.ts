import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ActiveUser, Auth, Role } from '../auth/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthType } from '../auth/enums/auth-type.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Create Review',
  })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Create a new review',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Post()
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @ActiveUser('sub') userId: string,
  ) {
    createReviewDto.userId = userId;
    return this.reviewsService.createReview(createReviewDto);
  }

  @ApiOperation({
    summary: 'Get my reviews',
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Get('my-reviews')
  findMyReviews(@ActiveUser('sub') userId: string) {
    return this.reviewsService.findMyReviews(userId);
  }

  // findReviewsByProductId
  @ApiOperation({
    summary: 'Get reviews by product id',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    required: true,
  })
  @Auth(AuthType.NONE)
  @Get('product/:productId')
  findReviewsByProductId(@Param('productId') productId: string) {
    return this.reviewsService.findReviewsByProductId(productId);
  }

  // findReviewById
  @ApiOperation({
    summary: 'Get review by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    required: true,
  })
  @Auth(AuthType.NONE)
  @Get(':id')
  findReviewById(@Param('id') id: string) {
    return this.reviewsService.findReviewById(id);
  }

  // updateMyReview
  @ApiOperation({
    summary: 'Update my review',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    required: true,
  })
  @ApiBody({
    type: UpdateReviewDto,
    description: 'Update a review',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Patch(':id')
  updateMyReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @ActiveUser('sub') userId: string,
  ) {
    updateReviewDto.userId = userId;
    return this.reviewsService.updateMyReview(id, updateReviewDto);
  }

  // deleteMyReview
  @ApiOperation({
    summary: 'Delete my review',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Delete('/my-reviews/:id')
  deleteMyReview(@Param('id') id: string, @ActiveUser('sub') userId: string) {
    return this.reviewsService.deleteMyReview(id, userId);
  }

  // deleteReview
  @ApiOperation({
    summary: 'Delete review',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Delete(':id')
  deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
