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
    field: 'is_admin',
  },
  firstName: {
    type: DataTypes.STRING,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING,
    field: 'last_name',
  },
};

export function initModel(sequelize: Sequelize): Model {
  return (UserModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('user'),
  });
}
