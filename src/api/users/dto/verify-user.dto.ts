import { ApiProperty } from '@nestjs/swagger';
import { UserAccountVerifyStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({
    description: 'user id to verify.',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'verify status',
    enum: UserAccountVerifyStatus,
    default: UserAccountVerifyStatus.VERIFIED,
  })
  @IsEnum(UserAccountVerifyStatus)
  @IsNotEmpty()
  verify_status: UserAccountVerifyStatus;
}
