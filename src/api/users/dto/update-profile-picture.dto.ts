import { ApiProperty } from '@nestjs/swagger';

export default class UpdateProfilePictureDto {
  @ApiProperty({
    description: 'Profile picture of the user (file upload)',
    type: 'string',
    format: 'binary',
    required: true,
  })
  profilePicture: string;
}
