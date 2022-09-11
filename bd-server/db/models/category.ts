import { DataTypes, Model, Sequelize } from 'sequelize';

import { IconModel } from './icon';
import { defaultModelAttributes, defaultModelOptions, InitModelAttributes } from './sequelize/shared';

export class CategoryModel extends Model {
  public id: string;
  public name: string;
  public description?: string;
  public icons?: IconModel[];
  public createdAt: Date;
  public updatedAt?: Date;
}

const attributes: InitModelAttributes<CategoryModel> = {
  ...defaultModelAttributes,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
};

export function initModel(sequelize: Sequelize): Model {
  return (CategoryModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('category'),
  });
}

export function initAssociations(models: any) {
  CategoryModel.belongsToMany(models.IconModel, { through: models.IconCategoryModel });
}
