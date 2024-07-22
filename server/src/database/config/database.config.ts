import { dataBaseConfig } from '../../config/validation/database.validation';

const config = {
  env: process.env.NODE_ENV,
  db: dataBaseConfig(),
};

export default config;
