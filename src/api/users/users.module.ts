import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UpdateProfilePictureProvider } from './providers/account/update-profile-picture.provider';
import { UpdateUserDataProvider } from './providers/account/update-user-data.provider';
import { UpdateUserPasswordProvider } from './providers/account/update-user-password.provider';
import { CreateUserProvider } from './providers/crud/create-user.provider';
import { DeleteUserByIdProvider } from './providers/crud/delete-user-by-id.provider';
import { FindAllUsersProvider } from './providers/crud/find-all-users.provider';
import { FindUserByIdProvider } from './providers/crud/find-user-by-id.provider';
import { UpdateUserByIdProvider } from './providers/crud/update-user-by-id.provider';
import { FindOneUserProvider } from './providers/find-one-user.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    FindOneUserProvider,
    FindUserByIdProvider,
    UpdateUserByIdProvider,
    DeleteUserByIdProvider,
    FindAllUsersProvider,
    CreateUserProvider,
    UpdateUserDataProvider,
    UpdateUserPasswordProvider,
    UpdateProfilePictureProvider,
  ],
  imports: [PrismaModule, AuthModule, FileUploadModule],
  exports: [UsersService],
})
export class UsersModule {}
