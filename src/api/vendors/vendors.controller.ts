import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(+id, updateVendorDto);
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
  @Delete(':id')
  deleteVendor(@Param('id') id: string) {
    return this.vendorsService.deleteVendor(id);
  }
}
