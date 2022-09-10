import { DataTypes, Model, Sequelize } from 'sequelize';

import { defaultModelAttributes, defaultModelOptions, InitModelAttributes } from './sequelize/shared';

export class BackgroundModel extends Model {
  public id: string;
  public name: string;
  public tags?: string[];
  public url: string;
  public createdAt: Date;
  public updatedAt?: Date;
}

const attributes: InitModelAttributes<BackgroundModel> = {
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
};

export function initModel(sequelize: Sequelize): Model {
  return (BackgroundModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('background'),
  });
}
