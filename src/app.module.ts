import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessagesModule } from './infrastructure/http/modules/messages/messages.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { AuthModule } from './infrastructure/http/auth/auth.module';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';


@Module({
  imports: [AuthModule, MessagesModule, LoggingModule],
  providers: [LoggingInterceptor, GlobalExceptionFilter],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
