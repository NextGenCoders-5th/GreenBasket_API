import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateProductProvider,
  DeleteProductByIdProvider,
  FindAllProductsProvider,
  FindOneProductProvider,
  FindProductByIdProvider,
  UpdateProductByIdProvider,
} from './providers';
import { IDeleteProductById } from './interfaces/delete-product-by-id.interface';
import { GetProductsDto } from './dto/get-products.dto';
import { FindProductsByCategoryProvider } from './providers/find-products-by-category.provider';
import { FindProductsByVendorProvider } from './providers/find-products-by-vendor.provider';

@Injectable()
export class ProductsService {
  constructor(
    private readonly createProductProvider: CreateProductProvider,
    private readonly deleteProductByIdProvider: DeleteProductByIdProvider,
    private readonly findAllProductsProvider: FindAllProductsProvider,
    private readonly findProductByIdProvider: FindProductByIdProvider,
    private readonly findOneProductProvider: FindOneProductProvider,
    private readonly updateProductByIdProvider: UpdateProductByIdProvider,
    private readonly findProductsByCategoryProvider: FindProductsByCategoryProvider,
    private readonly findProductsByVendorProvider: FindProductsByVendorProvider,
  ) {}

  createProduct(createProductDto: CreateProductDto) {
    return this.createProductProvider.createProduct(createProductDto);
  }

  findAllProducts(query: GetProductsDto) {
    return this.findAllProductsProvider.findAllProducts(query);
  }

  findProductById(id: string) {
    return this.findProductByIdProvider.findProductById(id);
  }

  updateProductById(id: string, updateProductDto: UpdateProductDto) {
    return this.updateProductByIdProvider.updateProductById(
      id,
      updateProductDto,
    );
  }

  deleteProductById(options: IDeleteProductById) {
    return this.deleteProductByIdProvider.deleteProductById(options);
  }

  findOneProduct(options: Partial<Product>) {
    return this.findOneProductProvider.findOneProduct(options);
  }

  findProductByCategory(categoryId: string) {
    return this.findProductsByCategoryProvider.findProductByCategory(
      categoryId,
    );
  }

  findProductsByVendor(vendorId: string) {
    return this.findProductsByVendorProvider.findProductsByVendor(vendorId);
  }
}
