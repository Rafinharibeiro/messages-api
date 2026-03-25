import { Message } from '../../../../core/domain/message/entities/message.entity';
import { MessageResponseDto } from './dto/message-response.dto';

export function toMessageResponse(message: Message): MessageResponseDto {
    return {
        id: message.id,
        content: message.content,
        sender: message.sender,
        sentAt: message.sentAt.toISOString(),
        status: message.status,
    };
}

export function toMessageResponseList(messages: Message[]): MessageResponseDto[] {
    return messages.map(toMessageResponse);
}
