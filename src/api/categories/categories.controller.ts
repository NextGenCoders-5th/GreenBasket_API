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
import { Role } from '../auth/decorators';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @ApiOperation({
    summary: 'Create Category.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.category,
      }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      createCategoryDto.image_url = this.fileUploadService.getFilePath(image);
    }
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Find All Categories.',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get()
  findAllCategories() {
    return this.categoriesService.findAllCategories();
  }

  @ApiOperation({
    summary: 'Find Category by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'category id',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get(':id')
  findCategoryById(@Param('id') id: string) {
    return this.categoriesService.findCategoryById(id);
  }

  @ApiOperation({
    summary: 'Update Category.',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'category id',
    required: true,
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.category,
      }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Patch(':id')
  updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategoryById(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete Category by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'category id',
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCategoryById(@Param('id') id: string) {
    return this.categoriesService.deleteCategoryById(id);
  }
}
