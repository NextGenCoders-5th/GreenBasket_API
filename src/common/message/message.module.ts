import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [ConfigModule],
})
export class MessageModule {}
