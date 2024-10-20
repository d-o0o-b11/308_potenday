import { IJwt } from '@config/interface';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const jwtConfig = registerAs('jwt', (): IJwt => {
  const config = {
    secretKey: process.env.JWT_SECRET_KEY,
    secretKeyExpire: process.env.JWT_SECRET_KEY_EXPIRE,
    cookieHeader: process.env.COOKIE_HEADER,
    cookieExpire: Number(process.env.COOKIE_EXPIRE),
  };

  const validationSchema: Joi.ObjectSchema = Joi.object<IJwt, true>({
    secretKey: Joi.string().required(),
    secretKeyExpire: Joi.string().required(),
    cookieHeader: Joi.string().required(),
    cookieExpire: Joi.number().required(),
  });

  const { error, value } = validationSchema.validate(config);

  if (error) {
    throw new Error(`Invalid JWT configuration: ${error.message}`);
  }

  return value;
});
