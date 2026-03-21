import { InvalidMessageStatusTransitionError } from 'src/core/application/errors/invalid-message-status-transition.error';
import { MessageStatus } from '../enums/message-status.enum';

export class Message {
    constructor(
        public readonly id: string,
        public content: string,
        public sender: string,
        public sentAt: Date,
        public status: MessageStatus,
    ) { }

    updateStatus(newStatus: MessageStatus) {
        const allowedTransitions: Record<MessageStatus, MessageStatus[]> = {
            [MessageStatus.SENT]: [MessageStatus.RECEIVED],
            [MessageStatus.RECEIVED]: [MessageStatus.READ],
            [MessageStatus.READ]: [],
        };

        if (!allowedTransitions[this.status].includes(newStatus)) {
            throw new InvalidMessageStatusTransitionError(this.status, newStatus);
        }

        this.status = newStatus;
    }
}
