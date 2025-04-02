import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UpdateUserByIdProvider {
  updateUserById(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
