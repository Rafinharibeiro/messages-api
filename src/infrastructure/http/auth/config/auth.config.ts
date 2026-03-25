export type AuthConfig = {
    email: string;
    password: string;
    jwtSecret: string;
};

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

export function getJwtSecretOrThrow(): string {
    const jwtSecret = process.env.JWT_SECRET?.trim();

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwtSecret;
}

export function loadAuthConfig(): AuthConfig {
    return {
        email: process.env.AUTH_EMAIL || '',
        password: process.env.AUTH_PASSWORD || '',
        jwtSecret: getJwtSecretOrThrow(),
    };
}
