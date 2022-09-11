import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultModelOptions, InitModelAttributes } from './sequelize/shared';

export class SessionModel extends Model {
  public sid: string;
  public expires: Date;
  public data: string;
  public createdAt: Date;
  public updatedAt?: Date;
}

const attributes: InitModelAttributes<SessionModel> = {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
  },
  data: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('now()'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

export function initModel(sequelize: Sequelize): Model {
  return (SessionModel as any).init(attributes, {
    sequelize,
    ...defaultModelOptions('Session'),
  });
}
