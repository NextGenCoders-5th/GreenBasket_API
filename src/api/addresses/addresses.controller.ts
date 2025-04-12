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
import { CreateUserAddressDto } from './dto/users/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/users/update-user-address.dto';
import { CreateVendorAddressDto } from './dto/vendors/create-vendor-address.dto';
import { UpdateVendorAddressDto } from './dto/vendors/update-vendor-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  // createUserAddress
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

  // createVendorAddress
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

  // findAllAddresses
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

  // findAddressById
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

  // updateUserAddress
  @ApiOperation({
    summary: 'Update User Address',
  })
  @ApiBody({
    type: UpdateUserAddressDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.CUSTOMER)
  @Patch('user')
  updateUserAddress(
    @Body() updateUserAddressDto: UpdateUserAddressDto,
    @ActiveUser('sub') userId: string,
  ) {
    updateUserAddressDto.userId = userId;
    return this.addressesService.updateUserAddress(updateUserAddressDto);
  }

  // updateVendorAddress
  @ApiOperation({
    summary: 'Update Vendor Address',
  })
  @ApiBody({
    type: UpdateVendorAddressDto,
    required: true,
  })
  @ApiParam({
    name: 'addressId',
    required: true,
    description: 'address id',
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Patch('vendor/:addressId')
  updateVendorAddress(
    @Body() updateVendorAddressDto: UpdateVendorAddressDto,
    @ActiveUser('sub') userId: string,
  ) {
    updateVendorAddressDto.userId = userId;
    return this.addressesService.updateVendorAddress(updateVendorAddressDto);
  }

  // deleteVendorAddressById
  @ApiOperation({
    summary: 'Delete Vendor Address',
  })
  @ApiParam({
    name: 'addressId',
    required: true,
    description: 'address id',
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('vendor/:addressId')
  deleteVendorAddressById(
    @Param('addressId') addressId: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.addressesService.deleteVendorAddressById({
      addressId,
      userId,
    });
  }

  // deleteAddressById
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
  deleteAddressById(@Param('id') id: string) {
    return this.addressesService.deleteAddressById(id);
  }
}
