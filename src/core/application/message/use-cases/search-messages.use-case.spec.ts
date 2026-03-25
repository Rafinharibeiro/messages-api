import { InvalidMessageSearchFilterError } from '../../errors/invalid-message-search-filter.error';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { SearchMessagesUseCase } from './search-messages.use-case';

describe('SearchMessagesUseCase', () => {
    let messageRepository: jest.Mocked<MessageRepository>;
    let useCase: SearchMessagesUseCase;


    const mockMessages = [
        Message.restore(
            'message-1',
            'Hello world',
            'rafael',
            new Date('2026-03-22T12:00:00.000Z'),
            MessageStatus.SENT,
        ),
    ];
    const startDate = new Date('2026-03-01T00:00:00.000Z');
    const endDate = new Date('2026-03-31T23:59:59.999Z');

    beforeEach(() => {
        messageRepository = {
            findBySender: jest.fn(),
            findByPeriod: jest.fn(),
            findBySenderAndPeriod: jest.fn(),
        } as any;

        useCase = new SearchMessagesUseCase(messageRepository);
    });

    it('should search messages by sender only', async () => {
        messageRepository.findBySender.mockResolvedValue(mockMessages);
        const result = await useCase.execute({ sender: 'rafael' });
        expect(messageRepository.findBySender).toHaveBeenCalledWith('rafael');
        expect(result).toEqual(mockMessages);
    });

    it('should search messages by period only', async () => {
        messageRepository.findByPeriod.mockResolvedValue(mockMessages);
        const result = await useCase.execute({ startDate, endDate });
        expect(messageRepository.findByPeriod).toHaveBeenCalledWith(startDate, endDate);
        expect(result).toEqual(mockMessages);
    });

    it('should search messages by sender and period combined', async () => {
        messageRepository.findBySenderAndPeriod.mockResolvedValue(mockMessages);
        const result = await useCase.execute({ sender: 'rafael', startDate, endDate });
        expect(messageRepository.findBySenderAndPeriod).toHaveBeenCalledWith(
            'rafael',
            startDate,
            endDate,
        );
        expect(result).toEqual(mockMessages);
    });

    it('should throw InvalidMessageSearchFilterError when no filters are provided', async () => {
        await expect(useCase.execute({})).rejects.toThrow(
            InvalidMessageSearchFilterError,
        );
    });
});