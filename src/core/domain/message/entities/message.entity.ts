import { InvalidMessageStatusTransitionError } from '../../../application/errors/invalid-message-status-transition.error';
import { MessageStatus } from '../enums/message-status.enum';

export class Message {

    private static readonly ALLOWED_TRANSITIONS: Record<MessageStatus, MessageStatus[]> = {
        [MessageStatus.SENT]: [MessageStatus.RECEIVED],
        [MessageStatus.RECEIVED]: [MessageStatus.READ],
        [MessageStatus.READ]: [],
    };


    private constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly sender: string,
        public readonly sentAt: Date,
        private internalStatus: MessageStatus,
    ) { }


    get status(): MessageStatus {
        return this.internalStatus;
    }

    public updateStatus(newStatus: MessageStatus): void {

        if (this.internalStatus === newStatus) {
            return;
        }
        const allowedNextStates = Message.ALLOWED_TRANSITIONS[this.internalStatus];
        if (!allowedNextStates.includes(newStatus)) {
            throw new InvalidMessageStatusTransitionError(this.internalStatus, newStatus);
        }
        this.internalStatus = newStatus;
    }


    public static create(id: string, content: string, sender: string): Message {
        if (!content?.trim()) {
            throw new Error('Message content cannot be empty');
        }

        if (!sender?.trim()) {
            throw new Error('Message sender cannot be empty');
        }
        return new Message(
            id,
            content.trim(),
            sender.trim(),
            new Date(),
            MessageStatus.SENT,
        );
    }

    public static restore(
        id: string,
        content: string,
        sender: string,
        sentAt: Date,
        status: MessageStatus,
    ): Message {
        return new Message(id, content, sender, sentAt, status);
    }
}