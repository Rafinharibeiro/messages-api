import * as winston from 'winston';
import DatadogLogsTransport from '@shelf/winston-datadog-logs-transport';
import os from 'os';

const isDev = process.env.NODE_ENV !== 'production';
const isDatadogEnabled = process.env.DATADOG_ENABLED === 'true';
const datadogApiKey = process.env.DATADOG_API_KEY;
const datadogService = process.env.DATADOG_SERVICE || 'messages-api';
const datadogEnv = process.env.DATADOG_ENV || process.env.NODE_ENV || 'dev';
const datadogHostname = process.env.DATADOG_HOSTNAME || os.hostname();

const transports: winston.transport[] = [
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
];

if (isDatadogEnabled && datadogApiKey) {
    transports.push(
        new DatadogLogsTransport({
            apiKey: datadogApiKey,
            service: datadogService,
            ddsource: 'nodejs',
            ddtags: `env:${datadogEnv}`,
            hostname: datadogHostname,
        }) as winston.transport,
    );
} else if (isDatadogEnabled && !datadogApiKey) {
    // eslint-disable-next-line no-console
    console.warn('DATADOG_ENABLED=true but DATADOG_API_KEY is missing');
}

export const winstonLoggerOptions = {
    transports,
};
