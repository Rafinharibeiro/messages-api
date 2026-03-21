import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';

export class UpdateMessageStatusUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(id: string, newStatus: MessageStatus): Promise<Message> {
        const message = await this.messageRepository.findById(id);

        if (!message) {
            throw new Error('Message not found');
        }
        message.updateStatus(newStatus);
        return this.messageRepository.updateStatus(id, message.status);
    }
}