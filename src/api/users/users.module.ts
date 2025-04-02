import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { DeleteUserByIdProvider } from './providers/crud/delete-user-by-id.provider';
import { FindAllUsersProvider } from './providers/crud/find-all-users.provider';
import { FindUserByIdProvider } from './providers/crud/find-user-by-id.provider';
import { UpdateUserByIdProvider } from './providers/crud/update-user-by-id.provider';
import { FindOneUserProvider } from './providers/find-one-user.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserProvider } from './providers/crud/create-user.provider';

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
  ],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
