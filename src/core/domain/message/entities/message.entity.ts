import { InvalidMessageStatusTransitionError } from '../../../application/errors/invalid-message-status-transition.error';
import { MessageStatus } from '../enums/message-status.enum';


export class Message {

    private static readonly ALLOWED_TRANSITIONS: Record<MessageStatus, MessageStatus[]> = {
        [MessageStatus.SENT]: [MessageStatus.RECEIVED],
        [MessageStatus.RECEIVED]: [MessageStatus.READ],
        [MessageStatus.READ]: [],
    };

    private constructor(

        private readonly _id: string,
        private _content: string,
        private readonly _sender: string,
        private readonly _sentAt: Date,
        private _status: MessageStatus,
    ) { }


    get id(): string { return this._id; }
    get content(): string { return this._content; }
    get sender(): string { return this._sender; }
    get sentAt(): Date { return this._sentAt; }
    get status(): MessageStatus { return this._status; }


    public updateStatus(newStatus: MessageStatus): void {
        const allowedNextStates = Message.ALLOWED_TRANSITIONS[this._status];
        if (!allowedNextStates.includes(newStatus)) {
            throw new InvalidMessageStatusTransitionError(this._status, newStatus);
        }
        this._status = newStatus;
    }


    public static create(id: string, content: string, sender: string): Message {
        if (!content || content.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }
        return new Message(
            id,
            content,
            sender,
            new Date(),
            MessageStatus.SENT
        );
    }


    public static restore(id: string, content: string, sender: string, sentAt: Date, status: MessageStatus): Message {
        return new Message(id, content, sender, sentAt, status);
    }
}