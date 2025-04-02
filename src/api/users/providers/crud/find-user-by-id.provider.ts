import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUserByIdProvider {
  findUserById(id: string) {
    return `This action returns a #${id} user`;
  }
}
