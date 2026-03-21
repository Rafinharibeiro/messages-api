import { Message } from '../../../domain/message/entities/message.entity';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';

interface SearchMessagesInput {
    sender?: string;
    startDate?: Date;
    endDate?: Date;
}

export class SearchMessagesUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(input: SearchMessagesInput): Promise<Message[]> {
        const { sender, startDate, endDate } = input;

        if (sender && startDate && endDate) {
            return this.messageRepository.findBySenderAndPeriod(
                sender,
                startDate,
                endDate,
            );
        }

        if (sender) {
            return this.messageRepository.findBySender(sender);
        }

        if (startDate && endDate) {
            return this.messageRepository.findByPeriod(startDate, endDate);
        }

        throw new Error(
            'You must provide sender or startDate and endDate for search',
        );
    }
}