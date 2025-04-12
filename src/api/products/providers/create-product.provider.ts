import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CreateProductProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async createProduct(createProductDto: CreateProductDto) {}
}
