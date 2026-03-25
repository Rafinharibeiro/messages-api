import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseApplicationError } from '../../core/application/errors/base-application.error';
import { AppLoggerService } from '../../infrastructure/logging/app-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: AppLoggerService) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const requestId = request.requestId || 'unknown';

        if (exception instanceof BaseApplicationError) {
            const status = this.mapApplicationErrorToStatus(exception.code);

            this.logger.warn('Application error handled', {
                requestId,
                path: request.url,
                code: exception.code,
                errorMessage: exception.message,
            });

            return response.status(status).json({
                statusCode: status,
                error: this.getHttpErrorName(status),
                message: exception.message,
                code: exception.code,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId,
            });
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            this.logger.warn('HTTP exception handled', {
                requestId,
                path: request.url,
                status,
                exceptionResponse,
            });

            return response.status(status).json({
                statusCode: status,
                error: this.getHttpErrorName(status),
                message: exceptionResponse,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId,
            });
        }

        this.logger.error('Unexpected internal error', {
            requestId,
            path: request.url,
            errorMessage: exception instanceof Error ? exception.message : 'Unknown error',
            stack: exception instanceof Error ? exception.stack : undefined,
        });

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            message: 'Unexpected internal error',
            code: 'INTERNAL_SERVER_ERROR',
            timestamp: new Date().toISOString(),
            path: request.url,
            requestId,
        });
    }

    private mapApplicationErrorToStatus(code: string): number {
        switch (code) {
            case 'MESSAGE_NOT_FOUND':
                return HttpStatus.NOT_FOUND;
            case 'INVALID_MESSAGE_STATUS_TRANSITION':
            case 'INVALID_MESSAGE_SEARCH_FILTER':
                return HttpStatus.BAD_REQUEST;
            default:
                return HttpStatus.BAD_REQUEST;
        }
    }

    private getHttpErrorName(status: number): string {
        switch (status) {
            case HttpStatus.BAD_REQUEST:
                return 'Bad Request';
            case HttpStatus.NOT_FOUND:
                return 'Not Found';
            case HttpStatus.UNAUTHORIZED:
                return 'Unauthorized';
            default:
                return 'Internal Server Error';
        }
    }
}
