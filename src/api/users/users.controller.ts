import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { Auth, Role } from '../auth/decorators';
import { AuthType } from '../auth/enums/auth-type.enum';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a User',
    description:
      'Create a User, user this route to create a new user. Admins only',
  })
  @ApiBody({
    required: true,
    type: CreateUserDto,
  })
  @ApiBearerAuth()
  @Auth(AuthType.BEARER)
  @Role(UserRole.ADMIN)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Find All Users',
    description: 'Find All Users, use this route to get all users. Admins only',
  })
  @Get()
  @ApiBearerAuth()
  @Auth(AuthType.BEARER)
  @Role(UserRole.ADMIN)
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @ApiOperation({
    summary: 'Find User By ID',
    description:
      'Find User By ID, use this route to get user by id. Admins only',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the user',
    required: true,
  })
  @ApiBearerAuth()
  @Auth(AuthType.BEARER)
  @Role(UserRole.ADMIN)
  @Get(':id')
  findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findUserById(id);
  }

  @ApiOperation({
    summary: 'Update User By ID',
    description:
      'Update User By ID, use this route to update user by id. Admins only',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the user',
    required: true,
  })
  @ApiBody({
    required: true,
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @Auth(AuthType.BEARER)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete User By ID',
    description:
      'Delete User By ID, use this route to delete user by id. Admins only',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the user',
    required: true,
  })
  @ApiBearerAuth()
  @Auth(AuthType.BEARER)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  deleteUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
