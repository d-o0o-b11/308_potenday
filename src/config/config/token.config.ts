import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsTokenConfig } from "../interface/token.config.interface";

export default registerAs("token", () => {
  const schema = Joi.object<IsTokenConfig, true>({
    jwt_access_secret: Joi.string().required(),
    jwt_access_expiration_time: Joi.string().required(),
    jwt_refresh_secret: Joi.string().required(),
    jwt_refresh_expiration_time: Joi.string().required(),
  });

  const config = {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expiration_time: process.env.JWT_ACCESS_EXPIRATION_TIME,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expiration_time: process.env.JWT_REFRESH_EXPIRATION_TIME,
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
