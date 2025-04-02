import { PartialType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';

export default class UpdateUserDto extends PartialType(CreateUserDto) {}
