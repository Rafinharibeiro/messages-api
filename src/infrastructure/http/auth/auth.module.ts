import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggingModule } from 'src/infrastructure/logging/logging.module';
import { AUTH_CONFIG, loadAuthConfig } from './config/auth.config';

@Module({
    imports: [
        PassportModule,
        LoggingModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: AUTH_CONFIG,
            useFactory: loadAuthConfig,
        },
        AuthService,
        JwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule { }
