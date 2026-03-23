export type AuthConfig = {
    email: string;
    password: string;
};

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

export function loadAuthConfig(): AuthConfig {
    return {
        email: process.env.AUTH_EMAIL || '',
        password: process.env.AUTH_PASSWORD || '',
    };
}
