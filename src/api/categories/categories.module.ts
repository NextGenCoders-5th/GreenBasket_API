import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryProvider } from './providers/create-category.provider';
import { DeleteCategoryByIdProvider } from './providers/delete-category-by-id.provider';
import { FindAllCategoriesProvider } from './providers/find-all-categories.provider';
import { FindCategoryByIdProvider } from './providers/find-category-by-id.provider';
import { FindOneCategoryProvider } from './providers/find-one-category.provider';
import { UpdateCategoryByIdProvider } from './providers/update-category-by-id.provider';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    FindAllCategoriesProvider,
    FindOneCategoryProvider,
    FindCategoryByIdProvider,
    UpdateCategoryByIdProvider,
    DeleteCategoryByIdProvider,
    CreateCategoryProvider,
  ],
  imports: [PrismaModule],
})
export class CategoriesModule {}
