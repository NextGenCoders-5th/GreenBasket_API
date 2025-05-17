import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ActiveUser, Auth, Role } from '../auth/decorators';
import { AuthType } from '../auth/enums/auth-type.enum';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfilePictureDto, UpdateUserDto } from './dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { FileUploadDirNames } from 'src/lib/constants/file-upload-dir-names';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  // find current user
  @ApiOperation({
    summary: 'Get current user',
    description: 'users can use this route to get their profile.',
  })
  @ApiBearerAuth()
  @Get('account/current-user')
  findCurrentUser(@ActiveUser('sub') id: string) {
    return this.usersService.findUserById(id);
  }

  @ApiOperation({
    summary: 'Update user profile-picture',
    description: 'users can use this route to update their profile picture.',
  })
  @ApiBody({
    required: true,
    type: UpdateProfilePictureDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor(
      'profilePicture',
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.user,
      }),
    ),
  )
  @Patch('account/profile-picture')
  updateMyProfilePicture(
    @UploadedFile() profilePicture: Express.Multer.File,
    @ActiveUser('sub') id: string,
  ) {
    if (!profilePicture) {
      throw new BadRequestException('Profile picture is required');
    }
    const updateProfilePictureDto: UpdateProfilePictureDto = {
      profilePicture: this.fileUploadService.getFilePath(profilePicture),
    };
    return this.usersService.updateProfilePicture(id, updateProfilePictureDto);
  }

  @ApiOperation({
    summary:
      'Complete users onboarding process / complete user profile information',
    description:
      'Complete users onboarding process / complete user profile information',
  })
  @ApiBody({
    type: CompleteOnboardingDto,
    required: true,
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'idPhoto_front', maxCount: 1 },
        { name: 'idPhoto_back', maxCount: 1 },
      ],
      FileUploadService.saveImageToStorage({
        dirName: FileUploadDirNames.user,
      }),
    ),
  )
  @Patch('account/complete-onboarding')
  completeOnboarding(
    @Body() completeOnboardingDto: CompleteOnboardingDto,
    @ActiveUser('sub') userId: string,
    @UploadedFiles()
    files: {
      idPhoto_front: Express.Multer.File;
      idPhoto_back: Express.Multer.File;
    },
  ) {
    completeOnboardingDto.userId = userId;
    completeOnboardingDto.idPhoto_front = this.fileUploadService.getFilePath(
      files.idPhoto_front[0],
    );
    completeOnboardingDto.idPhoto_back = this.fileUploadService.getFilePath(
      files.idPhoto_back[0],
    );
    return this.usersService.completeOnboarding(completeOnboardingDto);
  }

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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
