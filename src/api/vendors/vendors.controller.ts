import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDirNames } from 'src/lib/constants/file-upload-dir-names';

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
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor(
      'logo',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.vendor,
      }),
    ),
  )
  @Post()
  create(
    @Body() createVendorDto: CreateVendorDto,
    @UploadedFiles() logo: Express.Multer.File,
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(+id);
  }
}
