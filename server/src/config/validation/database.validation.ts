import { registerAs } from '@nestjs/config';
import { IDataBase } from '../interface';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';

export const dataBaseConfig = registerAs('database', (): IDataBase => {
  const config = {
    type: 'postgres' as DatabaseType,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    readType: 'postgres' as DatabaseType,
    readHost: process.env.READ_DB_HOST,
    readPort: process.env.READ_DB_PORT,
    readUsername: process.env.READ_DB_USERNAME,
    readPassword: process.env.READ_DB_PASSWORD,
    readDatabase: process.env.READ_DB_DATABASE,
  };

  const validationSchema: Joi.ObjectSchema = Joi.object<IDataBase, true>({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),

    readType: Joi.string().required(),
    readHost: Joi.string().required(),
    readPort: Joi.number().required(),
    readUsername: Joi.string().required(),
    readPassword: Joi.string().required(),
    readDatabase: Joi.string().required(),
  });

  const { error, value } = validationSchema.validate(config);

  if (error) {
    throw new Error(`Invalid Database configuration: ${error.message}`);
  }

  return value;
});
