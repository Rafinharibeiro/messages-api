import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppLoggerService } from './app-logger.service';
import { winstonLoggerOptions } from './logger.config';

@Module({
    imports: [WinstonModule.forRoot(winstonLoggerOptions)],
    providers: [AppLoggerService],
    exports: [AppLoggerService],
})
export class LoggingModule { }
