import { Injectable, Logger } from '@nestjs/common';
import { LoggerPort } from '../../core/application/ports/logger.port';

@Injectable()
export class AppLoggerService extends LoggerPort {
    private readonly context = 'Application';

    log(message: string, meta?: Record<string, any>) {
        const logger = new Logger(this.context);
        logger.log({
            message,
            ...meta,
        });
    }

    warn(message: string, meta?: Record<string, any>) {
        const logger = new Logger(this.context);
        logger.warn({
            message,
            ...meta,
        });
    }

    error(message: string, meta?: Record<string, any>) {
        const logger = new Logger(this.context);
        logger.error({
            message,
            ...meta,
        });
    }
}