import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { IsAppConfig } from '../interface/swagger.interface';

export default registerAs('app', () => {
  const schema = Joi.object<IsAppConfig, true>({
    swagger_id: Joi.string().required(),
    swagger_pw: Joi.string().required(),
  });

  const config = {
    swagger_id: process.env.SWAGGER_ID,
    swagger_pw: process.env.SWAGGER_PW,
  };

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return value;
});
