import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  appName: process.env.APP_NAME,
  apiVersion: process.env.API_VERSION,
  apiPrefix: process.env.API_PREFIX,
  backendUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.BACKEND_URL_DEV
      : process.env.BACKEND_URL_PROD,
  frontendUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.FRONTEND_URL_DEV
      : process.env.FRONTEND_URL_PROD,
  resetPasswordFrontendUrl: process.env.RESET_PASSWORD_FRONTEND_URL,
  defaultSysPassword: process.env.DEFAULT_SYS_PASSWORD,
}));
