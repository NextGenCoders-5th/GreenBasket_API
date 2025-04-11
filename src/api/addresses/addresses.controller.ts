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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ActiveUser, Role } from '../auth/decorators';
import { AddressesService } from './addresses.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { CreateVendorAddressDto } from './dto/create-vendor-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({
    summary: 'Create User Address',
    description: 'use this api endpoint to create an address for user.',
  })
  @ApiBody({
    type: CreateUserAddressDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Post('user')
  createUserAddress(
    @Body() createUserAddressDto: CreateUserAddressDto,
    @ActiveUser('sub') userId: string,
  ) {
    createUserAddressDto.userId = userId;
    return this.addressesService.createUserAddress(createUserAddressDto);
  }

  @ApiOperation({
    summary: 'Create Vendor Address',
    description: 'use this api endpoint to create an address for Vendor.',
  })
  @ApiBody({
    type: CreateVendorAddressDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Post('vendor')
  createVendorAddress(createVendorAddressDto: CreateVendorAddressDto) {
    return this.addressesService.createVendorAddress(createVendorAddressDto);
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
