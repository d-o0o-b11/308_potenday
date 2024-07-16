import { readDataBaseConfig } from '@config';
import { nodeEnv } from '../../common';
import * as dotenv from 'dotenv';

dotenv.config({
  path: __dirname + `envs/${nodeEnv()}.env`,
});

const config = {
  env: process.env.NODE_ENV,
  db: readDataBaseConfig(),
};

export default config;
