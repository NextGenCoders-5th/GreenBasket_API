import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  appName: process.env.APP_NAME,
  apiVersion: process.env.API_VERSION,
  apiPrefix: process.env.API_PREFIX,
  backendUrl: process.env.BACKEND_URL,
  frontendUrl: process.env.FRONTEND_URL,
  resetPasswordFrontendUrl: process.env.RESET_PASSWORD_FRONTEND_URL,
  defaultSysPassword: process.env.DEFAULT_SYS_PASSWORD,
}));
