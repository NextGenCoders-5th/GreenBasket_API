import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ActiveUser, Auth, Role } from '../auth/decorators';
import { UserRole } from '@prisma/client';
import { AuthType } from '../auth/enums/auth-type.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { FileUploadDirNames } from 'src/lib/constants/file-upload-dir-names';

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
    @ActiveUser('sub') vendorId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createProductDto.vendorId = vendorId;
    if (image) {
      createProductDto.image_url = this.fileUploadService.getFilePath(image);
    }
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({
    summary: 'Find All Products',
  })
  @Auth(AuthType.NONE)
  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
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
    @ActiveUser('sub') vendorId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    updateProductDto.vendorId = vendorId;
    if (image) {
      updateProductDto.image_url = this.fileUploadService.getFilePath(image);
    }
    return this.productsService.updateProductById(id, updateProductDto);
  }

  @Role(UserRole.VENDOR)
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
