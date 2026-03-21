import { BaseApplicationError } from './base-application.error';

export class MessageNotFoundError extends BaseApplicationError {
    constructor(id: string) {
        super(`Message with id "${id}" not found`, 'MESSAGE_NOT_FOUND');
    }
}