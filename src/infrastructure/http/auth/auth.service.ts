import 'dotenv/config';
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppLoggerService } from 'src/infrastructure/logging/app-logger.service';
import * as authConfig from './config/auth.config';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly appLogger: AppLoggerService,
        @Inject(authConfig.AUTH_CONFIG)
        private readonly authConfig: authConfig.AuthConfig,
    ) { }

    async login(email: string, password: string) {
        const { email: validEmail, password: validPassword } =
            this.authConfig;

        if (!validEmail || !validPassword) {
            this.appLogger.error('Authentication credentials are not configured');
            throw new InternalServerErrorException(
                'Authentication is not configured',
            );
        }

        if (email !== validEmail || password !== validPassword) {
            this.appLogger.warn('Invalid login attempt', { email });
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: email, email };
        this.appLogger.log('User logged in successfully', { email });

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}
