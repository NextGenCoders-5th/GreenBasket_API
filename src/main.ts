import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerConfigModule } from './common/swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const API_PREFIX = process.env.API_PREFIX || 'api/v1';
  // global prefix
  app.setGlobalPrefix(API_PREFIX);

  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      // properties that does not exist in the dto will be stripped
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)), // Apply ClassSerializerInterceptor globally
  );

  // enable cors
  app.enableCors();
  app.use(cookieParser());
  app.use(helmet());

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useLogger(app.get(Logger));

  // Setup Swagger
  SwaggerConfigModule.setup(app);

  await app.listen(5000);
}
bootstrap();
