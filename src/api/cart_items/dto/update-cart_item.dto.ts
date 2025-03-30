import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart_item.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
