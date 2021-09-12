import { Sequelize } from 'sequelize-typescript';

import { Models } from '../db/models';

export class Database {
  public static sequelize: Sequelize;
  public static schema = 'public';

  public static async connect() {
    const { API_ENV, DATABASE_URL } = process.env;
    const prefix = `[Icon Lab DB ${API_ENV.toUpperCase()}]`;

    if (this.sequelize) {
      console.warn(`${prefix} The connection already exists`);
      return;
    }

    try {
      this.sequelize = this.getSequelizeInstance(DATABASE_URL);

      await this.sequelize.authenticate();
      console.log(`${prefix} Connected at ${new Date().toLocaleString()}`);
    } catch (e) {
      console.error(`${prefix} Error was thrown`, e);
    }
  }

  private static getSequelizeInstance(databaseUrl: string) {
    return new Sequelize(databaseUrl, {
      ssl: true,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 30000,
      },
      models: Models,
      storage: 'sequelize',
      logging: false,
    });
  }
}
