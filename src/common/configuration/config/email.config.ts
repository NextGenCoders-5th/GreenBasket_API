import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM,

  sendgrid_username: process.env.SENDGRID_USERNAME,
  sendgrid_password: process.env.SENDGRID_PASSWORD,
}));
