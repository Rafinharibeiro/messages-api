import { BaseApplicationError } from './base-application.error';

export class InvalidMessageStatusTransitionError extends BaseApplicationError {
    constructor(currentStatus: string, newStatus: string) {
        super(
            `Invalid status transition from "${currentStatus}" to "${newStatus}"`,
            'INVALID_MESSAGE_STATUS_TRANSITION',
        );
    }
}