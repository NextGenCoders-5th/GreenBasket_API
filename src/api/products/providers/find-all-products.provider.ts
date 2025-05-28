import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { GetProductsDto } from '../dto/get-products.dto';

@Injectable()
export class FindAllProductsProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllProducts(query: GetProductsDto) {
    try {
      const {
        search,
        page,
        limit,
        minPrice,
        maxPrice,
        status,
        vendorId,
        categoryId,
        isFeatured,
        sortBy,
        sortOrder,
      } = query;

      // Build the where condition
      const whereCondition: Prisma.ProductWhereInput = {
        AND: [
          // Search across text fields
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { unit: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          // Price range
          minPrice ? { price: { gte: minPrice } } : {},
          maxPrice ? { price: { lte: maxPrice } } : {},
          // Status filter
          status ? { status } : {},
          // Vendor filter
          vendorId ? { vendorId } : {},
          // Featured products filter
          typeof isFeatured === 'boolean' ? { is_featured: isFeatured } : {},
          // Category filter
          categoryId
            ? {
                categories: {
                  some: {
                    id: categoryId,
                  },
                },
              }
            : {},
        ],
      };

      // Build the orderBy condition
      const orderBy: Prisma.ProductOrderByWithRelationInput = {
        [sortBy || 'createdAt']: sortOrder || 'desc',
      };

      // Get products with filters, search and pagination
      const products = await this.prisma.product.findMany({
        where: whereCondition,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          Vendor: {
            select: {
              id: true,
              business_name: true,
              business_email: true,
              logo_url: true,
              have_bank_details: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Get total count with filters
      const totalItems = await this.prisma.product.count({
        where: whereCondition,
      });

      const totalPages = Math.ceil(totalItems / limit);

      return CreateApiResponse({
        status: 'success',
        message: 'Find all products successful.',
        metadata: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,
        },
        data: products,
      });
    } catch (err) {
      console.log('findAllProducts error: ', err);
      throw new InternalServerErrorException(
        'Unable to find products. Please try again later.',
      );
    }
  }
}
