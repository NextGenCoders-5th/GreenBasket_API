import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { FileUploadDirNames } from 'src/lib/constants/file-upload-dir-names';
import { ActiveUser, Auth, Role } from '../auth/decorators';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @ApiOperation({
    summary: 'Create Product.',
  })
  @ApiBody({
    type: CreateProductDto,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.product,
      }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @ActiveUser('sub') userId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createProductDto.userId = userId;
    if (image) {
      createProductDto.image_url = this.fileUploadService.getFilePath(image);
    }
    console.log({ createProductDto });
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({
    summary: 'Find All Products',
  })
  @Auth(AuthType.NONE)
  @Get()
  findAllProducts(@Query() query: GetProductsDto) {
    return this.productsService.findAllProducts(query);
  }

  @ApiOperation({
    summary: 'find products by category',
  })
  @ApiParam({
    name: 'id',
    description: 'category id',
    required: true,
  })
  @Auth(AuthType.NONE)
  @Get('category/:id')
  findProductByCategory(@Param('id') categoryId: string) {
    return this.productsService.findProductByCategory(categoryId);
  }

  @ApiOperation({
    summary: 'Find Product by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'product id',
    required: true,
  })
  @Auth(AuthType.NONE)
  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @ApiOperation({
    summary: 'Create Product.',
  })
  @ApiBody({
    type: UpdateProductDto,
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'product id',
    required: true,
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.product,
      }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Patch(':id')
  updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @ActiveUser('sub') userId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    updateProductDto.userId = userId;
    if (image) {
      updateProductDto.image_url = this.fileUploadService.getFilePath(image);
    }
    return this.productsService.updateProductById(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete Product by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'product id',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProductById(
    @Param('id') id: string,
    @ActiveUser('sub') vendorId: string,
  ) {
    return this.productsService.deleteProductById({
      productId: id,
      vendorId,
    });
  }
}
