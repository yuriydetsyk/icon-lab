import { Sequelize } from 'sequelize-typescript';

import { Models } from '../db/models';

export class Database {
  public static sequelize: Sequelize;
  public static schema = 'public';

  public static async connect() {
    const { ICONLAB_ENV, ICONLAB_DB_USERNAME, ICONLAB_DB_PASSWORD, ICONLAB_DB_PORT } = process.env;
    const prefix = `[Icon Lab DB ${ICONLAB_ENV.toUpperCase()}]`;

    if (this.sequelize) {
      console.warn(`${prefix} The connection already exists`);
      return;
    }

    try {
      const isProduction = process.env.ICONLAB_ENV !== 'dev';
      const databaseUrl = `postgres://${ICONLAB_DB_USERNAME}:${ICONLAB_DB_PASSWORD}@${isProduction ? 'database' : '127.0.0.1'}:${ICONLAB_DB_PORT}/iconlab`;
      this.sequelize = this.getSequelizeInstance(databaseUrl);

      await this.sequelize.authenticate();
      console.log(`${prefix} Connected at ${new Date().toLocaleString()}`);
    } catch (e) {
      console.error(`${prefix} Error was thrown`, e);
    }
  }

  private static getSequelizeInstance(databaseUrl: string) {
    return new Sequelize(databaseUrl, {
      dialect: 'postgres',
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
