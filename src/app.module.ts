import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessagesModule } from './infrastructure/http/modules/messages/messages.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { AuthModule } from './infrastructure/http/auth/auth.module';


@Module({
  imports: [AuthModule, MessagesModule],
  controllers: [],
  providers: [LoggingInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}