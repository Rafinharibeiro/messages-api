import { MessageStatus } from '../enums/message-status.enum';
import { InvalidMessageStatusTransitionError } from '../../../application/errors/invalid-message-status-transition.error';
import { Message } from './message.entity';

describe('Message Entity', () => {
    const createMessage = (status: MessageStatus) =>
        new Message(
            'message-1',
            'Hello world',
            'rafael',
            new Date('2026-03-22T12:00:00.000Z'),
            status,
        );

    it('should update status from SENT to RECEIVED', () => {
        const message = createMessage(MessageStatus.SENT);

        message.updateStatus(MessageStatus.RECEIVED);

        expect(message.status).toBe(MessageStatus.RECEIVED);
    });

    it('should update status from RECEIVED to READ', () => {
        const message = createMessage(MessageStatus.RECEIVED);

        message.updateStatus(MessageStatus.READ);

        expect(message.status).toBe(MessageStatus.READ);
    });

    it('should throw when trying to update status from SENT directly to READ', () => {
        const message = createMessage(MessageStatus.SENT);

        expect(() => message.updateStatus(MessageStatus.READ)).toThrow(
            InvalidMessageStatusTransitionError,
        );
    });

    it('should throw when trying to update status after READ', () => {
        const message = createMessage(MessageStatus.READ);

        expect(() => message.updateStatus(MessageStatus.RECEIVED)).toThrow(
            InvalidMessageStatusTransitionError,
        );
    });
});