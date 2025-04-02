import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import environmentValidation from './environment.validation';
import { appConfig, cookieConfig, databaseConfig, jwtConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, jwtConfig, cookieConfig],
      validationSchema: environmentValidation,
    }),
  ],
})
export class ConfigurationModule {}
