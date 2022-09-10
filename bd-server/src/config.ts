import { Options } from 'sequelize';


type SequelizeConfig = Partial<Options> & {
  migrationStorage: string;
  migrationStorageTableName: string;
  seederStorage: string;
  seederStorageTableName: string;
};

type Config = {
  server: {
    env: 'dev' | 'stage' | 'prod';
    port: number;
    sessionSecret: string;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    imgBucket: string;
  };
  db: SequelizeConfig;
};

const missingEnvVars: string[] = [];
const getEnvValue = <T = string>(envVar: string, fallback?: T): T => {
  const value = process.env[envVar] ?? fallback;
  if (value === undefined) {
    missingEnvVars.push(envVar);
  }
  return value as T;
};

export const isProduction = getEnvValue<string>('ICONLAB_ENV', 'dev') !== 'dev';

export const config: Config = {
  server: {
    env: getEnvValue('ICONLAB_ENV'),
    port: parseInt(getEnvValue('ICONLAB_PORT'), 10) ?? 4800,
    sessionSecret: getEnvValue('ICONLAB_SESSION_SECRET'),
  },
  aws: {
    accessKeyId: getEnvValue('ICONLAB_AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvValue('ICONLAB_AWS_SECRET_ACCESS_KEY'),
    imgBucket: getEnvValue('ICONLAB_AWS_IMG_BUCKET'),
  },
  db: {
    database: 'iconlab',
    host: isProduction ? 'database' : '127.0.0.1',
    port: parseInt(getEnvValue('ICONLAB_DB_PORT'), 10),
    username: getEnvValue('ICONLAB_DB_USERNAME'),
    password: getEnvValue('ICONLAB_DB_PASSWORD'),
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 30000,
    },
    storage: 'sequelize',
    logging: false,
  },
};

export const dbConfig: SequelizeConfig = { ...config.db };

if (missingEnvVars.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    'ERROR: Mandatory environmental variable(s) are missing:\n',
    missingEnvVars.join(', ')
  );
  throw new Error('Missing env variable');
}
