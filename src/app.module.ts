import { Module } from '@nestjs/common';
import { MessagesModule } from './infrastructure/http/modules/messages/messages.module';


@Module({
  imports: [MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
