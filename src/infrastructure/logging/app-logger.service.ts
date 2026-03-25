import { Injectable, Logger } from '@nestjs/common';
import { LoggerPort } from '../../core/application/ports/logger.port';

@Injectable()
export class AppLoggerService extends LoggerPort {
    private readonly logger = new Logger('Application');

    log(message: string, meta?: Record<string, any>) {
        this.logger.log({ message, ...meta });
    }

    warn(message: string, meta?: Record<string, any>) {
        this.logger.warn({ message, ...meta });
    }

    error(message: string, meta?: Record<string, any>) {
        this.logger.error({ message, ...meta });
    }
}