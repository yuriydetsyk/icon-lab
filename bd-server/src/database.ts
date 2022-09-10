import { Sequelize } from 'sequelize';

import * as Models from '../db/models';
import { ModelDefinition, ModelDefinitionContext } from '../db/models/sequelize/shared';
import { config, dbConfig } from './config';

export class Database {
  public static sequelize: Sequelize;
  public static schema = 'public';
  private static readonly models: ModelDefinitionContext = {};

  public static async connect() {
    const prefix = `[Icon Lab DB ${config.server.env.toUpperCase()}]`;

    if (this.sequelize) {
      console.warn(`${prefix} The connection already exists`);
      return;
    }

    try {
      this.sequelize = new Sequelize(dbConfig);

      await this.sequelize.authenticate();
      console.log(`${prefix} Connected at ${new Date().toLocaleString()}`);
    } catch (e) {
      console.error(`${prefix} Error was thrown`, e);
    }
  }

  public static initModels(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(Models).forEach((modelDefinition: ModelDefinition<any>) => {
      // Model file exports something like `class UserModel; initModel(); initAssociations();`.
      // We need the proper name of the class which varies from model to model.
      const modelClassName = Object
        .keys(modelDefinition)
        .filter((name) => /^[A-Z].*Model$/.test(name))[0];
      const model = modelDefinition.initModel(Database.sequelize);

      Database.models[modelClassName] = model;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(Models).forEach((modelDefinition: ModelDefinition<any>) => {
      if (modelDefinition.initAssociations) {
        modelDefinition.initAssociations(Database.models);
      }
    });
  }
}
