import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const request = context.switchToHttp().getRequest();
        const { method, originalUrl, url } = request;
        const route = originalUrl || url;
        const requestId = request.requestId || 'unknown';

        return next.handle().pipe(
            tap(() => {
                this.logger.log({
                    message: 'HTTP request completed',
                    method,
                    path: route,
                    requestId,
                    durationMs: Date.now() - now,
                });
            }),
            catchError((error) => {
                this.logger.error({
                    message: 'HTTP request failed',
                    method,
                    path: route,
                    requestId,
                    durationMs: Date.now() - now,
                    errorMessage: error?.message,
                    errorCode: error?.code,
                });

                return throwError(() => error);
            }),
        );
    }
}