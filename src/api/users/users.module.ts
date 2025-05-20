import { Module } from '@nestjs/common';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CompleteOnboardingProvider } from './providers/account/complete-onboarding.provider';
import { FindAllVerificationRequestsProvider } from './providers/account/find-all-verification-requests.provider';
import { RequestAccountVerificationProvider } from './providers/account/request-account-verification.provider';
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
import { VerifyUserProvider } from './providers/account/verify-user.provider';

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
    CompleteOnboardingProvider,
    RequestAccountVerificationProvider,
    FindAllVerificationRequestsProvider,
    VerifyUserProvider,
  ],
  imports: [PrismaModule, AuthModule, FileUploadModule],
  exports: [UsersService],
})
export class UsersModule {}
