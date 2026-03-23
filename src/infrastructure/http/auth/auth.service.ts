import 'dotenv/config';
import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppLoggerService } from 'src/infrastructure/logging/app-logger.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly appLogger: AppLoggerService,
    ) { }

    async login(username: string, password: string) {
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;

        if (!validUsername || !validPassword) {
            this.appLogger.error('Authentication credentials are not configured');
            throw new InternalServerErrorException(
                'Authentication is not configured',
            );
        }

        if (username !== validUsername || password !== validPassword) {
            this.appLogger.warn('Invalid login attempt', { username });
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: username, username };
        this.appLogger.log('User logged in successfully', { username });

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}
