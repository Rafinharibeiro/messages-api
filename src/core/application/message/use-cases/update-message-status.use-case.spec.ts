import { MessageNotFoundError } from '../../errors/message-not-found.error';
import { LoggerPort } from '../../ports/logger.port';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { UpdateMessageStatusUseCase } from './update-message-status.use-case';
import { InvalidMessageStatusTransitionError } from '../../../application/errors/invalid-message-status-transition.error';

describe('UpdateMessageStatusUseCase', () => {
    let messageRepository: jest.Mocked<MessageRepository>;
    let logger: jest.Mocked<LoggerPort>;
    let useCase: UpdateMessageStatusUseCase;

    const createMockMessage = (status: MessageStatus) =>
        Message.restore(
            'message-1',
            'Hello world',
            'rafael',
            new Date('2026-03-22T12:00:00.000Z'),
            status,
        );

    beforeEach(() => {
        messageRepository = {
            findById: jest.fn(),
            updateStatus: jest.fn(),
        } as any;

        logger = {
            log: jest.fn(),
            warn: jest.fn(),
        } as any;

        useCase = new UpdateMessageStatusUseCase(messageRepository, logger);
    });

    it('should update status from SENT to RECEIVED successfully', async () => {
        const initialMessage = createMockMessage(MessageStatus.SENT);
        const updatedMessage = createMockMessage(MessageStatus.RECEIVED);
        messageRepository.findById.mockResolvedValue(initialMessage);
        messageRepository.updateStatus.mockResolvedValue(updatedMessage);
        const result = await useCase.execute('message-1', MessageStatus.RECEIVED);
        expect(messageRepository.findById).toHaveBeenCalledWith('message-1');
        expect(messageRepository.updateStatus).toHaveBeenCalledWith('message-1', MessageStatus.RECEIVED);
        expect(result.status).toBe(MessageStatus.RECEIVED);
    });

    it('should log a warning and throw when message does not exist', async () => {
        messageRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute('invalid-id', MessageStatus.RECEIVED))
            .rejects.toThrow(MessageNotFoundError);

        expect(logger.warn).toHaveBeenCalledWith(
            'Message not found during status update',
            expect.objectContaining({ messageId: 'invalid-id' })
        );
    });

    it('should NOT update repository if entity validation fails (SENT to READ)', async () => {
        const initialMessage = createMockMessage(MessageStatus.SENT);
        messageRepository.findById.mockResolvedValue(initialMessage);
        await expect(useCase.execute('message-1', MessageStatus.READ))
            .rejects.toThrow(InvalidMessageStatusTransitionError);
        expect(messageRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should log the successful transition with previous and new status', async () => {
        const initialMessage = createMockMessage(MessageStatus.SENT);
        const updatedMessage = createMockMessage(MessageStatus.RECEIVED);
        messageRepository.findById.mockResolvedValue(initialMessage);
        messageRepository.updateStatus.mockResolvedValue(updatedMessage);

        await useCase.execute('message-1', MessageStatus.RECEIVED);

        expect(logger.log).toHaveBeenCalledWith(
            'Message status updated successfully',
            expect.objectContaining({
                previousStatus: MessageStatus.SENT,
                newStatus: MessageStatus.RECEIVED,
            })
        );
    });
});