import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  url: process.env.DATABASE_URL,
}));
