import { randomUUID } from 'crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: any, _res: any, next: () => void) {
        req.requestId = req.headers['x-request-id'] || randomUUID();
        next();
    }
}