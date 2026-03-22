import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    async login(username: string, password: string) {
        const validUsername = process.env.AUTH_USERNAME || 'admin';
        const validPassword = process.env.AUTH_PASSWORD || 'admin123';

        if (username !== validUsername || password !== validPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: username, username };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}