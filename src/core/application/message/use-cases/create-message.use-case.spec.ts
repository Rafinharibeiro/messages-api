import { LoggerPort } from '../../ports/logger.port';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { CreateMessageUseCase } from './create-message.use-case';

describe('CreateMessageUseCase', () => {
    let messageRepository: jest.Mocked<MessageRepository>;
    let logger: jest.Mocked<LoggerPort>;
    let useCase: CreateMessageUseCase;

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

        useCase = new CreateMessageUseCase(messageRepository, logger);
    });

    it('should create a message with SENT status', async () => {
        messageRepository.create.mockImplementation(async (message) => message);

        const result = await useCase.execute({
            content: 'Hello world',
            sender: 'rafael',
        });

        expect(messageRepository.create).toHaveBeenCalledTimes(1);
        expect(result.content).toBe('Hello world');
        expect(result.sender).toBe('rafael');
        expect(result.status).toBe(MessageStatus.SENT);
        expect(result.id).toBeDefined();
        expect(result.sentAt).toBeInstanceOf(Date);
    });

    it('should log message creation successfully', async () => {
        messageRepository.create.mockImplementation(async (message) => message);

        const result = await useCase.execute({
            content: 'Hello world',
            sender: 'rafael',
        });

        expect(logger.log).toHaveBeenCalledWith(
            'Message created successfully',
            expect.objectContaining({
                source: 'CreateMessageUseCase',
                messageId: result.id,
                sender: 'rafael',
                status: MessageStatus.SENT,
            }),
        );
    });
});