import {
  BadRequestException,
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
import { Role } from '../../auth/decorators';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @ApiOperation({
    summary: 'create a vendor',
    description: 'use this api endpoint to create a vendor.',
  })
  @ApiBody({
    type: CreateVendorDto,
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'logo',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.vendor,
      }),
    ),
  )
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Post()
  create(
    @Body() createVendorDto: CreateVendorDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    if (!logo) {
      throw new BadRequestException('busines logo is required.');
    }
    createVendorDto.logo_url = this.fileUploadService.getFilePath(logo);
    return this.vendorsService.createVendor(createVendorDto);
  }

  @ApiOperation({
    summary: 'Find All Vendors.',
    description: 'use this endpoint to find all vendors.',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get()
  findAllVendors() {
    return this.vendorsService.findAllVendors();
  }

  @ApiOperation({
    summary: 'Find Vendor By ID.',
    description: 'use this api endpoint to find vendor by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'vendor id',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get(':id')
  findVendorById(@Param('id') id: string) {
    return this.vendorsService.findVendorById(id);
  }

  @ApiOperation({
    summary: 'Update Vendor By ID.',
    description: 'use this endpoint to find vendor by id and update it',
  })
  @ApiBody({
    required: true,
    type: UpdateVendorDto,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'vendor id.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'logo',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.vendor,
      }),
    ),
  )
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Patch(':id')
  updateVendor(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    if (logo) {
      updateVendorDto.logo_url = this.fileUploadService.getFilePath(logo);
    }
    return this.vendorsService.updateVendor(id, updateVendorDto);
  }

  @ApiOperation({
    summary: 'Delete Vendor by ID',
    description: 'use this api endpoint to delete vendor by id.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'vendor id',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteVendor(@Param('id') id: string) {
    return this.vendorsService.deleteVendor(id);
  }
}
