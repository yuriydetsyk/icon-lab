import { DataTypes, Model, Sequelize } from 'sequelize';

import { defaultModelAttributes, defaultModelOptions, InitModelAttributes } from './sequelize/shared';

export class IconCategoryModel extends Model {
  public iconId: string;
  public categoryId: string;
}
const attributes: InitModelAttributes<IconCategoryModel> = {
  iconId: {
    allowNull: false,
    type: DataTypes.UUID,
    field: 'icon_id',
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.UUID,
    field: 'category_id',
  },
  createdAt: defaultModelAttributes.createdAt,
  updatedAt: defaultModelAttributes.updatedAt,
};

export function initModel(sequelize: Sequelize): Model {
  return (IconCategoryModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('icon_category'),
  });
}

export function initAssociations(models: any) {
  IconCategoryModel.belongsTo(models.IconModel);
  IconCategoryModel.belongsTo(models.CategoryModel);
}
