import * as Joi from 'joi';

export default Joi.object({
  // app config
  APP_NAME: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  API_PREFIX: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  RESET_PASSWORD_FRONTEND_URL: Joi.string().required(),
  DEFAULT_SYS_PASSWORD: Joi.string().required(),

  // database config
  DATABASE_URL: Joi.string().required(),

  // jwt config
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),

  // cookie config
  COOKIE_ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  COOKIE_REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),

  // chapa payment get way
  CHAPA_WEBHOOK_URL: Joi.string().required(),
  CHAPA_WEBHOOK_SECRET: Joi.string().required(),
  CHAPA_SECRET_KEY: Joi.string().required(),
});
