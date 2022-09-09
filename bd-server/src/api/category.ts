import Category from '../../db/models/category';
import IconCategory from '../../db/models/icon-category';

export async function getCategories() {
  return await Category.findAll();
}

export async function patchCategory(category: Partial<Category>) {
  return await Category.update(category, { where: { id: category.id } });
}

export async function addCategory(category: Category) {
  return await Category.create(category as Partial<Category>);
}

export async function addIconCategory(iconId: string, categoryId: string) {
  return await IconCategory.create({
    iconId,
    categoryId,
  });
}

export async function deleteCategory(categoryId: string) {
  return await Category.destroy({
    where: { id: categoryId },
  });
}

export async function deleteIconCategory(iconId: string, categoryId: string) {
  return await IconCategory.destroy({
    where: { iconId, categoryId },
  });
}
