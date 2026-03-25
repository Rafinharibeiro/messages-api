import { randomUUID } from 'crypto';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { LoggerPort } from '../../ports/logger.port';

// Exportar a interface é uma boa prática para caso o Controller precise usá-la como tipagem
export interface CreateMessageInput {
    content: string;
    sender: string;
}

export class CreateMessageUseCase {


    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly logger: LoggerPort,
    ) { }

    public async execute(input: CreateMessageInput): Promise<Message> {
        const message = Message.create(
            randomUUID(),
            input.content,
            input.sender
        );
        await this.messageRepository.create(message);

        this.logger.log('Message created successfully', {
            source: 'CreateMessageUseCase',
            messageId: message.id,
            sender: message.sender,
            status: message.status,
        });

        return message;
    }
}