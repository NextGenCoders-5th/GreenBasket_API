import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { FindOneUserProvider } from '../find-one-user.provider';

@Injectable()
export class DeleteUserByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly findOneUserProvider: FindOneUserProvider,
  ) {}
  async deleteUserById(id: string) {
    const user = await this.findOneUserProvider.findOneUser({ id });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    try {
      await this.prisma.user.delete({ where: { id } });
      // remove file related to user from the server.
      this.fileUploadService.removeFile(user.profile_picture);
    } catch (err) {
      console.log('Error delete user: ', err);
      throw new InternalServerErrorException(
        'Unable to delete user. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Delete user by id successfull.',
      data: null,
    });
  }
}
