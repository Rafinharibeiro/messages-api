import { MessageNotFoundError } from '../../errors/message-not-found.error';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { GetMessageByIdUseCase } from './get-message-by-id.use-case';

describe('GetMessageByIdUseCase', () => {
    let messageRepository: jest.Mocked<MessageRepository>;
    let useCase: GetMessageByIdUseCase;

    const message = new Message(
        'message-1',
        'Hello world',
        'rafael',
        new Date('2026-03-22T12:00:00.000Z'),
        MessageStatus.SENT,
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

        useCase = new GetMessageByIdUseCase(messageRepository);
    });

    it('should return message when it exists', async () => {
        messageRepository.findById.mockResolvedValue(message);

        const result = await useCase.execute('message-1');

        expect(messageRepository.findById).toHaveBeenCalledWith('message-1');
        expect(result).toEqual(message);
    });

    it('should throw MessageNotFoundError when message does not exist', async () => {
        messageRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute('message-1')).rejects.toThrow(
            MessageNotFoundError,
        );
    });
});