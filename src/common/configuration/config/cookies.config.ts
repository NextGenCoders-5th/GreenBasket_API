import { registerAs } from '@nestjs/config';
import { DayToTimestamp } from 'src/lib/helpers/day-to-timestamp';

export default registerAs('cookieConfig', () => ({
  accessTokenExpiresIn: DayToTimestamp(
    parseInt(process.env.COOKIE_ACCESS_TOKEN_EXPIRES_IN, 10),
  ),
  refreshTokenExpiresIn: DayToTimestamp(
    parseInt(process.env.COOKIE_REFRESH_TOKEN_EXPIRES_IN, 10),
  ),
}));
