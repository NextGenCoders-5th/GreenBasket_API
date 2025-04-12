import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UpdateProductByIdProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {}
}
