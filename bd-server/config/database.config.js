const isProduction = process.env.ICONLAB_ENV !== 'dev';

module.exports = {
  username: process.env.ICONLAB_DB_USERNAME,
  password: process.env.ICONLAB_DB_PASSWORD,
  database: 'iconlab',
  host: isProduction ? 'database' : '127.0.0.1',
  port: process.env.ICONLAB_DB_PORT,
  dialect: 'postgres',
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data',
};
