import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { LoggerPort } from '../../core/application/ports/logger.port';

@Injectable()
export class AppLoggerService extends LoggerPort {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: WinstonLogger,
    ) {
        super();
    }

    log(message: string, meta?: Record<string, any>) {
        this.logger.info(message, meta);
    }

    warn(message: string, meta?: Record<string, any>) {
        this.logger.warn(message, meta);
    }

    error(message: string, meta?: Record<string, any>) {
        this.logger.error(message, meta);
    }
}
