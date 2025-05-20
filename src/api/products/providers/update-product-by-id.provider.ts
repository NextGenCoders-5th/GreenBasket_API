import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category, Vendor } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FindOneProductProvider } from './find-one-product.provider';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateProductByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneProductProvider: FindOneProductProvider,
  ) {}

  public async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
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
    } = updateProductDto;

    let vendor: Vendor;
    try {
      vendor = await this.prisma.vendor.findFirst({ where: { userId } });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'unable to find vendor. please try again later.',
      );
    }

    if (!vendor) {
      throw new NotFoundException('vendor not found.');
    }

    // check if product exists
    let product = await this.findOneProductProvider.findOneProduct({
      id,
      vendorId: vendor.id,
    });

    if (!product) {
      throw new NotFoundException('vendor has not this product');
    }

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

    // update products
    try {
      product = await this.prisma.product.update({
        where: { id },
        data: {
          name: name ?? product.name,
          description: description ?? product.description,
          image_url: image_url ?? product.image_url,
          price: price ?? product.price,
          discount_price: discount_price ?? product.discount_price,
          unit: unit ?? product.unit,
          stock: stock ?? product.stock,
          categories: categories
            ? { set: categories.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          categories: true,
        },
      });
    } catch (err) {
      console.log('update-product: ', err);
      throw new InternalServerErrorException('');
    }

    return CreateApiResponse({
      status: 'success',
      message: 'update product successfull',
      data: product,
    });
  }
}
