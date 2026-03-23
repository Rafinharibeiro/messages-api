import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppLoggerService } from '../../logging/app-logger.service';
import { LoginUserUseCase } from '../../../core/application/auth/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../../core/application/auth/use-cases/register-user.use-case';
import { InvalidCredentialsError } from 'src/core/application/errors/invalid-credentials.error';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly appLogger: AppLoggerService,
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
    ) { }

    async register(name: string, email: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.registerUserUseCase.execute({
            name,
            email,
            passwordHash,
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async login(email: string, password: string) {
        const user = await this.loginUserUseCase.execute(email);

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            this.appLogger.warn('Invalid login attempt due to wrong password', {
                source: 'AuthService',
                email,
            });

            throw new InvalidCredentialsError();
        }

        const payload = { sub: user.id, email: user.email };

        this.appLogger.log('User logged in successfully', {
            source: 'AuthService',
            userId: user.id,
            email: user.email,
        });

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}