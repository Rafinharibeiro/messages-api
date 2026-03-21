import { randomUUID } from 'crypto';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';

interface CreateMessageInput {
    content: string;
    sender: string;
}

export class CreateMessageUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(input: CreateMessageInput): Promise<Message> {
        const message = new Message(
            randomUUID(),
            input.content,
            input.sender,
            new Date(),
            MessageStatus.SENT,
        );

        return this.messageRepository.create(message);
    }
}