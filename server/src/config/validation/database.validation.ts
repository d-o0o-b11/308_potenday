import { IDataBase } from '../interface';
import { registerAs } from '@nestjs/config';
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
  };

  const validationSchema: Joi.ObjectSchema = Joi.object<IDataBase, true>({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
  });

  const { error, value } = validationSchema.validate(config);

  if (error) {
    throw new Error(`Invalid Database configuration: ${error.message}`);
  }

  return value;
});
