import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateProfilePictureDto } from '../../dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindOneUserProvider } from '../find-one-user.provider';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';

@Injectable()
export class UpdateProfilePictureProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneUserProvider: FindOneUserProvider,
    private readonly fileUploadService: FileUploadService,
  ) {}
  public async updateProfilePicture(
    id: string,
    updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    // find user
    let user = await this.findOneUserProvider.findOneUser({ id });
    // check if he have profile picture
    // if their remove it from the file system
    if (user.profile_picture) {
      this.fileUploadService.removeFile(user.profile_picture);
    }
    // update users profile picture
    try {
      user = await this.prisma.user.update({
        where: { id },
        data: {
          profile_picture: updateProfilePictureDto.profilePicture,
        },
      });
    } catch (err) {
      console.log('updateProfilePicture: ', err);
      throw new InternalServerErrorException(
        'Unable to update user profile picture. please try again later.',
      );
    }
    // send response;
    return CreateApiResponse({
      status: 'success',
      message: 'user profile picture updated successfully.',
      data: user,
    });
  }
}
