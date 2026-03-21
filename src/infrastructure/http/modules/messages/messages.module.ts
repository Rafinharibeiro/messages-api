import { Module } from '@nestjs/common';
import { CreateMessageUseCase } from '../../../../core/application/message/use-cases/create-message.use-case';
import { GetMessageByIdUseCase } from '../../../../core/application/message/use-cases/get-message-by-id.use-case';
import { SearchMessagesUseCase } from '../../../../core/application/message/use-cases/search-messages.use-case';
import { UpdateMessageStatusUseCase } from '../../../../core/application/message/use-cases/update-message-status.use-case';
import { MessageRepository } from '../../../../core/domain/message/repositories/message.repository';
import { InMemoryMessageRepository } from '../../../persistence/in-memory/repositories/in-memory-message.repository';
import { MessagesController } from './messages.controller';

@Module({
    controllers: [MessagesController],
    providers: [
        {
            provide: MessageRepository,
            useClass: InMemoryMessageRepository,
        },
        {
            provide: CreateMessageUseCase,
            useFactory: (messageRepository: MessageRepository) =>
                new CreateMessageUseCase(messageRepository),
            inject: [MessageRepository],
        },
        {
            provide: GetMessageByIdUseCase,
            useFactory: (messageRepository: MessageRepository) =>
                new GetMessageByIdUseCase(messageRepository),
            inject: [MessageRepository],
        },
        {
            provide: SearchMessagesUseCase,
            useFactory: (messageRepository: MessageRepository) =>
                new SearchMessagesUseCase(messageRepository),
            inject: [MessageRepository],
        },
        {
            provide: UpdateMessageStatusUseCase,
            useFactory: (messageRepository: MessageRepository) =>
                new UpdateMessageStatusUseCase(messageRepository),
            inject: [MessageRepository],
        },
    ],
})
export class MessagesModule { }