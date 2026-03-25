import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getJwtSecretOrThrow } from '../config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: getJwtSecretOrThrow(),
        });
    }

    async validate(payload: { sub: string; email: string }) {
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}
