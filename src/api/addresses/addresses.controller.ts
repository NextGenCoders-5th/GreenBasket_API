import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Role } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @ApiOperation({
    summary: 'Find All Addresses.',
    description: 'use this endpoint to find all addresses',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get()
  findAllAddresses() {
    return this.addressesService.findAllAddresses();
  }

  @ApiOperation({
    summary: 'Find Address By ID',
    description: 'use this api endpoint to find address by id.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'address id',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @Get(':id')
  findAddressById(@Param('id') id: string) {
    return this.addressesService.findAddressById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @ApiOperation({
    summary: 'Delete Address by ID',
    description: 'Use this api endpoint to delete address by ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'address id.',
  })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.deleteAddressById(id);
  }
}
