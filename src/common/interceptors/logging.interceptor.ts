import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppLoggerService } from '../../infrastructure/logging/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userEmail = user?.email ?? 'anonymous';
        const { method, originalUrl, url } = request;
        const route = originalUrl || url;
        const requestId = request.requestId || 'unknown';

        return next.handle().pipe(
            tap(() => {
                this.logger.log('HTTP request completed', {
                    user: userEmail,
                    method,
                    path: route,
                    requestId,
                    durationMs: Date.now() - now,
                });
            }),
            catchError((error) => {
                this.logger.error('HTTP request failed', {
                    user: userEmail,
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
