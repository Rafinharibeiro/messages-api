import * as winston from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

export const winstonLoggerOptions = {
    transports: [
        new winston.transports.Console({
            format: isDev
                ? winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.printf(({ level, message, timestamp, ...meta }) => {
                        return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''
                            }`;
                    }),
                )
                : winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
        }),
    ],
};