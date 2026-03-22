import { Message } from '../../../domain/message/entities/message.entity';
import { MessageStatus } from '../../../domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';
import { MessageNotFoundError } from '../../errors/message-not-found.error';
import { LoggerPort } from '../../ports/logger.port';

export class UpdateMessageStatusUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly logger: LoggerPort,
    ) { }

    async execute(id: string, newStatus: MessageStatus): Promise<Message> {
        const message = await this.messageRepository.findById(id);
        if (!message) {
            this.logger.warn('Message not found during status update', {
                source: 'UpdateMessageStatusUseCase',
                messageId: id,
                attemptedStatus: newStatus,
            });
            throw new MessageNotFoundError(id);
        }
        const previousStatus = message.status;

        message.updateStatus(newStatus);

        const updatedMessage = await this.messageRepository.updateStatus(id, message.status);
        this.logger.log('Message status updated successfully', {
            source: 'UpdateMessageStatusUseCase',
            messageId: updatedMessage.id,
            previousStatus,
            newStatus: updatedMessage.status,
        });
        return updatedMessage;
    }
}