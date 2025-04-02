import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllUsersProvider {
  findAllUsers() {
    return `This action returns all users`;
  }
}
