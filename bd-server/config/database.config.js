const config = require('dotenv-flow').config;
const parse = require('pg-connection-string').parse;

// Load .env file
config();

const dbConfig = parse(process.env.DATABASE_URL);

module.exports = {
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  host: dbConfig.host,
  port: dbConfig.port,
  ssl: true,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data',
};
