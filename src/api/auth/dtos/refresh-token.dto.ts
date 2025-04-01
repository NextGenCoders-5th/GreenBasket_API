import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'valid refresh token.',
    example: 'your refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
