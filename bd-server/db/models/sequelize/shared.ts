import { DataTypes, InitOptions, Model, ModelAttributes, ModelStatic, Sequelize } from 'sequelize';

export function defaultModelOptions(tableName: string): Partial<InitOptions> {
  return {
    tableName,
    modelName: snakeCaseToCamelCase(tableName),
    freezeTableName: true,
    underscored: true,
  };
}

export const defaultModelAttributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false,
    defaultValue: Sequelize.literal('now()'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: true,
  },
};

export type InitModelAttributes<T extends Model = Model> = ModelAttributes<T, T['_attributes']>;

export type ModelDefinition<M extends typeof Model> = M & {
  modelAttributes: ModelAttributes;
  initModel: (sequelize: Sequelize) => typeof Model;
  initAssociations?: (models: ModelDefinitionContext) => void;
};

export type ModelDefinitionContext = {
  [key: string]: ModelStatic<Model<any, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

function snakeCaseToCamelCase(snakeCase: string) {
  return snakeCase.replace(/(_[a-z])/g, (group) => group.toUpperCase().replace('_', ''));
}
