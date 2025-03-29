import * as Joi from 'joi';

export default Joi.object({
  // app config
  APP_NAME: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  API_PREFIX: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  RESET_PASSWORD_FRONTEND_URL: Joi.string().required(),

  // database config
  DATABASE_URL: Joi.string().required(),
});
