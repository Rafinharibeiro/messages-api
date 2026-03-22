import { randomUUID } from 'crypto';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { LoggerPort } from '../../ports/logger.port';

interface CreateMessageInput {
    content: string;
    sender: string;
}

export class CreateMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly logger: LoggerPort,

    ) { }

    async execute(input: CreateMessageInput): Promise<Message> {
        const message = new Message(
            randomUUID(),
            input.content,
            input.sender,
            new Date(),
            MessageStatus.SENT,
        );

        const createdMessage = await this.messageRepository.create(message);

        this.logger.log('Message created successfully', {
            source: 'CreateMessageUseCase',
            messageId: createdMessage.id,
            sender: createdMessage.sender,
            status: createdMessage.status,
        });

        return createdMessage;
    }
}