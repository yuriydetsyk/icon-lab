import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultModelAttributes, defaultModelOptions, InitModelAttributes } from './sequelize/shared';

export class UserModel extends Model {
  public id: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public firstName?: string;
  public lastName?: string;
  public createdAt: Date;
  public updatedAt?: Date;
}

const attributes: InitModelAttributes<UserModel> = {
  ...defaultModelAttributes,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
};

export function initModel(sequelize: Sequelize): Model {
  return (UserModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('user'),
  });
}
