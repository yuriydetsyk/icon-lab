import { DataTypes, Model, Sequelize } from 'sequelize';

import { IconType } from '../../src/models/enums/icon-type';
import { CategoryModel } from './category';
import { defaultModelAttributes, defaultModelOptions, InitModelAttributes } from './sequelize/shared';

export class IconModel extends Model {
  public id: string;
  public name: string;
  public tags?: string[];
  public url: string;
  public type: IconType;
  public categories?: CategoryModel[];
  public isPremium: boolean;
  public originalId: string;
  public createdAt: Date;
  public updatedAt?: Date;
}

const attributes: InitModelAttributes<IconModel> = {
  ...defaultModelAttributes,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export function initModel(sequelize: Sequelize): Model {
  return (IconModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('icon'),
  });
}

export function initAssociations(models: any) {
  IconModel.belongsToMany(models.CategoryModel, { through: models.IconCategoryModel });
}
