import { Controller, Get } from '@nestjs/common';
import { AuthType } from './api/auth/enums/auth-type.enum';
import { Auth } from './api/auth/decorators';

@Controller('/') // <- disables global prefix
@Auth(AuthType.NONE)
export class AppController {
  @Get()
  getInfo() {
    return {
      name: 'Multivendor Market Place API',
      description: 'Multivendor Market Place API built using NestJS',
      docs: '/api-docs',
      timestamp: new Date(),
    };
  }
}
