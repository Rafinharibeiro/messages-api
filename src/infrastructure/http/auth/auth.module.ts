import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginUserUseCase } from '../../../core/application/auth/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../../core/application/auth/use-cases/register-user.use-case';
import { LoggerPort } from '../../../core/application/ports/logger.port';
import { LoggingModule } from '../../logging/logging.module';
import { AppLoggerService } from '../../logging/app-logger.service';
import { InMemoryUserRepository } from '../../persistence/in-memory/repositories/in-memory-user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from 'src/core/domain/user/repository/user.repository';

@Module({
    imports: [
        PassportModule,
        LoggingModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: UserRepository,
            useClass: InMemoryUserRepository,
        },
        {
            provide: LoggerPort,
            useClass: AppLoggerService,
        },
        {
            provide: RegisterUserUseCase,
            useFactory: (userRepository: UserRepository, logger: LoggerPort) =>
                new RegisterUserUseCase(userRepository, logger),
            inject: [UserRepository, LoggerPort],
        },
        {
            provide: LoginUserUseCase,
            useFactory: (userRepository: UserRepository, logger: LoggerPort) =>
                new LoginUserUseCase(userRepository, logger),
            inject: [UserRepository, LoggerPort],
        },
        AuthService,
        JwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule { }