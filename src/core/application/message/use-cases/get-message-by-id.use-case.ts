import { MessageNotFoundError } from '../../errors/message-not-found.error';
import { Message } from '../../../domain/message/entities/message.entity';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';

export class GetMessageByIdUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(id: string): Promise<Message> {
        const message = await this.messageRepository.findById(id);
        if (!message) {
            throw new MessageNotFoundError(id);
        }
        return message;
    }
}