import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart_item.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCartItemDto extends PartialType(
  OmitType(CreateCartItemDto, ['productId']),
) {}
