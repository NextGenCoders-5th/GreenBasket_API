import { Injectable } from '@nestjs/common';
import { DeleteUserByIdProvider } from './providers/crud/delete-user-by-id.provider';
import { FindUserByIdProvider } from './providers/crud/find-user-by-id.provider';
import { FindOneUserProvider } from './providers/find-one-user.provider';
import { FindAllUsersProvider } from './providers/crud/find-all-users.provider';
import { UpdateUserByIdProvider } from './providers/crud/update-user-by-id.provider';
import { CreateUserProvider } from './providers/crud/create-user.provider';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly updateUserByIdProvider: UpdateUserByIdProvider,
    private readonly findAllUsersProvider: FindAllUsersProvider,
    private readonly findOneUserProvider: FindOneUserProvider,
    private readonly findUserByIdProvider: FindUserByIdProvider,
    private readonly deleteUserByIdProvider: DeleteUserByIdProvider,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  findAllUsers() {
    return this.findAllUsersProvider.findAllUsers();
  }

  findUserById(id: string) {
    return this.findUserByIdProvider.findUserById(id);
  }

  updateUserById(id: string, updateUserDto: UpdateUserDto) {
    return this.updateUserByIdProvider.updateUserById(id, updateUserDto);
  }

  deleteUserById(id: string) {
    return this.deleteUserByIdProvider.deleteUserById(id);
  }

  findOneUser(options: Partial<User>) {
    return this.findOneUserProvider.findOneUser(options);
  }
}
