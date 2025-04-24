import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetProductsBaseDto {}

export class GetProductsDto extends IntersectionType(
  GetProductsBaseDto,
  PaginationQueryDto,
) {}
