import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerConfigModule {
  static setup(app: INestApplication) {
    const ENV = process.env.NODE_ENV || 'development';

    const config = new DocumentBuilder()
      .setTitle('Multivendor market place backend api')
      .setDescription('Multivendor market place backend API built using NestJS')
      .setVersion('1.0.0')
      .addServer(
        ENV === 'development'
          ? process.env.BACKEND_URL_DEV
          : process.env.BACKEND_URL_PROD,
      )
      .addBearerAuth() // Add Bearer token support
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }
}
