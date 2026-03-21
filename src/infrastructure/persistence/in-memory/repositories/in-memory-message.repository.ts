import { Message } from '../../../../core/domain/message/entities/message.entity';
import { MessageStatus } from '../../../../core/domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../../core/domain/message/repositories/message.repository';

export class InMemoryMessageRepository extends MessageRepository {
    private readonly messages: Message[] = [];

    async create(message: Message): Promise<Message> {
        this.messages.push(message);
        return message;
    }

    async findById(id: string): Promise<Message | null> {
        const message = this.messages.find((item) => item.id === id);
        return message ?? null;
    }

    async findBySender(sender: string): Promise<Message[]> {
        return this.messages.filter((item) => item.sender === sender);
    }

    async findByPeriod(startDate: Date, endDate: Date): Promise<Message[]> {
        return this.messages.filter(
            (item) => item.sentAt >= startDate && item.sentAt <= endDate,
        );
    }

    async findBySenderAndPeriod(
        sender: string,
        startDate: Date,
        endDate: Date,
    ): Promise<Message[]> {
        return this.messages.filter(
            (item) =>
                item.sender === sender &&
                item.sentAt >= startDate &&
                item.sentAt <= endDate,
        );
    }

    async updateStatus(id: string, status: MessageStatus): Promise<Message> {
        const message = this.messages.find((item) => item.id === id);

        if (!message) {
            throw new Error('Message not found');
        }

        message.status = status;
        return message;
    }
}