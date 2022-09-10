import { CategoryModel } from '../../db/models/category';
import { IconCategoryModel } from '../../db/models/icon-category';

export async function getCategories() {
  return await CategoryModel.findAll();
}

export async function patchCategory(category: Partial<CategoryModel>) {
  return await CategoryModel.update(category, { where: { id: category.id } });
}

export async function addCategory(category: CategoryModel) {
  return await CategoryModel.create(category as Partial<CategoryModel>);
}

export async function addIconCategory(iconId: string, categoryId: string) {
  return await IconCategoryModel.create({
    iconId,
    categoryId,
  });
}

export async function deleteCategory(categoryId: string) {
  return await CategoryModel.destroy({
    where: { id: categoryId },
  });
}

export async function deleteIconCategory(iconId: string, categoryId: string) {
  return await IconCategoryModel.destroy({
    where: { iconId, categoryId },
  });
}
