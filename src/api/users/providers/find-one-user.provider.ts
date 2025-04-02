import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class FindOneUserProvider {
  findOneUser(options: Partial<User>) {
    return 'this action not implemented';
  }
}
