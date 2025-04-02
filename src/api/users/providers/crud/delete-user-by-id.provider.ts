import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserByIdProvider {
  deleteUserById(id: string) {
    return `This action removes a #${id} user`;
  }
}
