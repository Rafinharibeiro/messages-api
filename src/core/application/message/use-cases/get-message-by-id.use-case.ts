import { Message } from '../../../domain/message/entities/message.entity';
import { MessageRepository } from '../../../domain/message/repositories/message.repository';

export class GetMessageByIdUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(id: string): Promise<Message | null> {
        return this.messageRepository.findById(id);
    }
}