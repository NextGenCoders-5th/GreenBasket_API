import { registerAs } from '@nestjs/config';

export default registerAs('paymentConfig', () => ({
  chapaWebhookUrl: process.env.CHAPA_WEBHOOK_URL,
  chapaWebhookSecret: process.env.CHAPA_WEBHOOK_SECRET,
  chapaSecretKey: process.env.CHAPA_SECRET_KEY,
}));
