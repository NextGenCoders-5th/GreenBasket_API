import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { CreateProductDto } from '../dto/create-product.dto';
import { VendorsService } from 'src/api/vendors/vendors/vendors.service';

@Injectable()
export class CreateProductProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService,
  ) {}

  public async createProduct(createProductDto: CreateProductDto) {
    const {
      name,
      description,
      image_url,
      price,
      discount_price,
      unit,
      stock,
      categories,
      userId,
    } = createProductDto;

    // Validate category IDs
    if (categories?.length) {
      let foundCategories: Category[] | undefined;

      try {
        foundCategories = await this.prisma.category.findMany({
          where: {
            id: { in: categories },
          },
        });
      } catch (err) {
        console.log('createProduct: ', err);
        throw new InternalServerErrorException(
          'Unable to find categories. please try again later.',
        );
      }

      const foundIds = foundCategories.map((categ) => categ.id);
      const missingIds = categories.filter((id) => !foundIds.includes(id));

      if (missingIds.length) {
        throw new BadRequestException(
          `Invalid category Ids, ${missingIds.join(', ')}`,
        );
      }
    }

    const vendor = await this.vendorService.findOneVendor({ userId });
    if (!vendor) {
      throw new BadRequestException('vendor not found.');
    }

    try {
      const product = await this.prisma.product.create({
        data: {
          name,
          description,
          price,
          discount_price,
          unit,
          stock,
          vendorId: vendor.id,
          image_url,
          categories: categories
            ? {
                connect: categories.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          categories: true,
        },
      });

      return CreateApiResponse({
        status: 'success',
        message: 'create product successfull.',
        data: product,
      });
    } catch (err) {
      console.log('createProduct: ', err);
      throw new InternalServerErrorException('');
    }
  }
}
