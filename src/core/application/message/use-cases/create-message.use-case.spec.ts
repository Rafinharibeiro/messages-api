import { LoggerPort } from '../../ports/logger.port';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { CreateMessageUseCase } from './create-message.use-case';

describe('CreateMessageUseCase', () => {
    let messageRepository: jest.Mocked<MessageRepository>;
    let logger: jest.Mocked<LoggerPort>;
    let useCase: CreateMessageUseCase;

    const input = { content: 'Hello world', sender: 'rafael' };

    beforeEach(() => {
        messageRepository = { create: jest.fn() } as any;
        logger = { log: jest.fn() } as any;
        useCase = new CreateMessageUseCase(messageRepository, logger);
    });

    it('should create and log a message successfully', async () => {
        messageRepository.create.mockImplementation(async (msg) => msg);
        const result = await useCase.execute(input);
        expect(messageRepository.create).toHaveBeenCalledWith(result);
        expect(result).toMatchObject({
            content: input.content,
            sender: input.sender,
            status: MessageStatus.SENT
        });
        expect(logger.log).toHaveBeenCalledWith(
            'Message created successfully',
            expect.objectContaining({
                messageId: result.id,
                status: MessageStatus.SENT,
            }),
        );
    });
});