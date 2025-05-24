import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductProvider } from './providers/create-product.provider';
import { DeleteProductByIdProvider } from './providers/delete-product-by-id.provider';
import { FindAllProductsProvider } from './providers/find-all-products.provider';
import { FindOneProductProvider } from './providers/find-one-product.provider';
import { FindProductByIdProvider } from './providers/find-product-by-id.provider';
import { UpdateProductByIdProvider } from './providers/update-product-by-id.provider';
import { VendorsModule } from '../vendors/vendors/vendors.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';
import { FindProductsByCategoryProvider } from './providers/find-products-by-category.provider';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CreateProductProvider,
    DeleteProductByIdProvider,
    FindProductByIdProvider,
    FindOneProductProvider,
    FindAllProductsProvider,
    UpdateProductByIdProvider,
    FindProductsByCategoryProvider,
  ],
  imports: [VendorsModule, PrismaModule, FileUploadModule],
  exports: [ProductsService],
})
export class ProductsModule {}
