import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCategoryProvider,
  DeleteCategoryByIdProvider,
  FindAllCategoriesProvider,
  FindCategoryByIdProvider,
  FindOneCategoryProvider,
  UpdateCategoryByIdProvider,
} from './providers';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly createCategoryProvider: CreateCategoryProvider,
    private readonly deleteCategoryByIdProvider: DeleteCategoryByIdProvider,
    private readonly findAllCategoriesProvider: FindAllCategoriesProvider,
    private readonly findCategoryByIdProvider: FindCategoryByIdProvider,
    private readonly findOneCategoryProvider: FindOneCategoryProvider,
    private readonly updateCategoryByIdProvider: UpdateCategoryByIdProvider,
  ) {}

  createCategory(createCategoryDto: CreateCategoryDto) {
    return this.createCategoryProvider.createCategory(createCategoryDto);
  }

  findAllCategories() {
    return this.findAllCategoriesProvider.findAllCategories();
  }

  findCategoryById(id: string) {
    return this.findCategoryByIdProvider.findCategoryById(id);
  }

  updateCategoryById(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.updateCategoryByIdProvider.updateCategoryById(
      id,
      updateCategoryDto,
    );
  }

  deleteCategoryById(id: string) {
    return this.deleteCategoryByIdProvider.deleteCategoryById(id);
  }

  findOneCategory(options: Partial<Category>) {
    return this.findOneCategoryProvider.findOneCategory(options);
  }
}
