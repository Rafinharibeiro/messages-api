import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsError extends ConflictException {
    constructor(email: string) {
        super(`User with email "${email}" already exists`);
    }
}