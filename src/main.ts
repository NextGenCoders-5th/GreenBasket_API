import {
  ClassSerializerInterceptor,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';
import { DecimalInterceptor } from './common/interceptors/serialize-prisma-decimals/decimal.interceptor';
import { SwaggerConfigModule } from './common/swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });

  const API_PREFIX = process.env.API_PREFIX || 'api/v1';
  // global prefix
  app.setGlobalPrefix(API_PREFIX, {
    exclude: [
      { path: '/api-docs', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET },
    ],
  });

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
    new DecimalInterceptor(),
  );

  // enable cors
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(helmet());

  //app.useStaticAssets(join(process.cwd(), 'public'));

  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'public', 'uploads'), {
      setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*'); // Or restrict to specific frontend domain
        res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // This is the key header
      },
    }),
  );

  // app.useLogger(app.get(Logger));

  // Setup Swagger
  SwaggerConfigModule.setup(app);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
