import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import environmentValidation from './environment.validation';
import {
  appConfig,
  cookieConfig,
  databaseConfig,
  jwtConfig,
  emailConfig,
  twilioConfig,
} from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        cookieConfig,
        emailConfig,
        twilioConfig,
      ],
      validationSchema: environmentValidation,
    }),
  ],
})
export class ConfigurationModule {}
