import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole, Vendor } from '@prisma/client';
import { ActiveUser, Role } from '../auth/decorators';
import { IActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors/vendors.service';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateUserAddressDto } from './dto/users/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/users/update-user-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly usersService: UsersService,
    private readonly vendorsService: VendorsService,
  ) {}

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
    type: CreateAddressDto,
    required: true,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR)
  @Post('vendor')
  createVendorAddress(
    @Body() createVendorAddressDto: CreateAddressDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.addressesService.createVendorAddress(
      userId,
      createVendorAddressDto,
    );
  }

  // FindUserAddressByIdProvider
  @ApiOperation({
    summary: 'Find User Address By User Id.',
  })
  @ApiQuery({
    name: 'userId',
    description:
      'admins can get the address of a user by sending userId. but customers can get their own address only.',
    required: false,
  })
  @ApiBearerAuth()
  @Get('user')
  async findUserAdressById(
    @Query('userId') userId: string,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    const { role, sub } = activeUserData;
    if (role === UserRole.CUSTOMER) {
      userId = sub;
    } else {
      if (!userId) throw new BadRequestException('user id is required.');
      // check if user exists
      const user = await this.usersService.findOneUser({ id: userId });
      if (!user) {
        throw new BadRequestException('user not found.');
      }
    }
    return this.addressesService.findUserAdressById(userId);
  }

  // FindVendorAddressesByIdProvider
  @ApiOperation({
    summary: 'Find Vendor Addresses By Id.',
    description: 'Find Vendor Addresses By Id.',
  })
  @ApiQuery({
    name: 'userId',
    description:
      'admins can get the address of vendors. userId is the id of ther user who owns the vendor.',
    required: false,
  })
  @ApiBearerAuth()
  @Role(UserRole.VENDOR, UserRole.ADMIN)
  @Get('vendor')
  async findVendorAdressesById(
    @Query('userId') userId: string,
    @ActiveUser() activeUserData: IActiveUserData,
  ) {
    const { role, sub } = activeUserData;
    let vendorId: string;
    let vendor: Vendor;
    if (role === UserRole.VENDOR) {
      vendor = await this.vendorsService.findOneVendor({
        userId: sub,
      });
      if (!vendor) throw new NotFoundException('vendor not found.');
      vendorId = vendor.id;
    } else {
      if (!userId) throw new BadRequestException('user id is required.');

      vendor = await this.vendorsService.findOneVendor({
        userId,
      });
      if (!vendor) throw new NotFoundException('vendor not found.');
      vendorId = vendor.id;
    }
    return this.addressesService.findVendorAdressesById(vendorId);
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
    type: UpdateAddressDto,
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
    @Param('addressId') addressId: string,
    @Body() updateVendorAddressDto: UpdateAddressDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.addressesService.updateVendorAddress(
      userId,
      addressId,
      updateVendorAddressDto,
    );
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
