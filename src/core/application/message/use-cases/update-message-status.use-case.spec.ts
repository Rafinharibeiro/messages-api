import { MessageNotFoundError } from '../../errors/message-not-found.error';
import { LoggerPort } from '../../ports/logger.port';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { UpdateMessageStatusUseCase } from './update-message-status.use-case';

describe('UpdateMessageStatusUseCase', () => {
    let messageRepository: jest.Mocked<MessageRepository>;
    let logger: jest.Mocked<LoggerPort>;
    let useCase: UpdateMessageStatusUseCase;

    const createMessage = (status: MessageStatus) =>
        new Message(
            'message-1',
            'Hello world',
            'rafael',
            new Date('2026-03-22T12:00:00.000Z'),
            status,
        );

    beforeEach(() => {
        messageRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findBySender: jest.fn(),
            findByPeriod: jest.fn(),
            findBySenderAndPeriod: jest.fn(),
            updateStatus: jest.fn(),
        };

        logger = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };

        useCase = new UpdateMessageStatusUseCase(messageRepository, logger);
    });

    it('should update status from SENT to RECEIVED', async () => {
        const message = createMessage(MessageStatus.SENT);
        const updatedMessage = createMessage(MessageStatus.RECEIVED);

        messageRepository.findById.mockResolvedValue(message);
        messageRepository.updateStatus.mockResolvedValue(updatedMessage);

        const result = await useCase.execute('message-1', MessageStatus.RECEIVED);

        expect(messageRepository.findById).toHaveBeenCalledWith('message-1');
        expect(messageRepository.updateStatus).toHaveBeenCalledWith(
            'message-1',
            MessageStatus.RECEIVED,
        );
        expect(result.status).toBe(MessageStatus.RECEIVED);
    });

    it('should throw MessageNotFoundError when message does not exist', async () => {
        messageRepository.findById.mockResolvedValue(null);

        await expect(
            useCase.execute('message-1', MessageStatus.RECEIVED),
        ).rejects.toThrow(MessageNotFoundError);

        expect(logger.warn).toHaveBeenCalledWith(
            'Message not found during status update',
            expect.objectContaining({
                source: 'UpdateMessageStatusUseCase',
                messageId: 'message-1',
                attemptedStatus: MessageStatus.RECEIVED,
            }),
        );
    });

    it('should throw when status transition is invalid', async () => {
        const message = createMessage(MessageStatus.SENT);

        messageRepository.findById.mockResolvedValue(message);

        await expect(
            useCase.execute('message-1', MessageStatus.READ),
        ).rejects.toThrow();

        expect(messageRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should log successful status update', async () => {
        const message = createMessage(MessageStatus.SENT);
        const updatedMessage = createMessage(MessageStatus.RECEIVED);

        messageRepository.findById.mockResolvedValue(message);
        messageRepository.updateStatus.mockResolvedValue(updatedMessage);

        await useCase.execute('message-1', MessageStatus.RECEIVED);

        expect(logger.log).toHaveBeenCalledWith(
            'Message status updated successfully',
            expect.objectContaining({
                source: 'UpdateMessageStatusUseCase',
                messageId: 'message-1',
                previousStatus: MessageStatus.SENT,
                newStatus: MessageStatus.RECEIVED,
            }),
        );
    });
});