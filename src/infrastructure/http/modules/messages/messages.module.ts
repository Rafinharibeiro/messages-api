import { Module } from '@nestjs/common';
import { CreateMessageUseCase } from '../../../../core/application/message/use-cases/create-message.use-case';
import { GetMessageByIdUseCase } from '../../../../core/application/message/use-cases/get-message-by-id.use-case';
import { SearchMessagesUseCase } from '../../../../core/application/message/use-cases/search-messages.use-case';
import { UpdateMessageStatusUseCase } from '../../../../core/application/message/use-cases/update-message-status.use-case';
import { MessageRepository } from '../../../../core/domain/message/repositories/message.repository';
import { MessagesController } from './messages.controller';
import { LoggerPort } from 'src/core/application/ports/logger.port';
import { AppLoggerService } from 'src/infrastructure/logging/app-logger.service';
import { LoggingModule } from 'src/infrastructure/logging/logging.module';
import { DynamoDbMessageRepository } from 'src/infrastructure/persistence/dynamodb/repositories/dynamodb-message.repository';

@Module({
    imports: [LoggingModule],
    controllers: [MessagesController],
    providers: [
        {
            provide: MessageRepository,
            useClass: DynamoDbMessageRepository,
        },
        {
            provide: LoggerPort,
            useClass: AppLoggerService,
        },
        {
            provide: CreateMessageUseCase,
            useFactory: (
                messageRepository: MessageRepository,
                logger: LoggerPort,
            ) => new CreateMessageUseCase(messageRepository, logger),
            inject: [MessageRepository, LoggerPort],
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
            useFactory: (
                messageRepository: MessageRepository,
                logger: LoggerPort,
            ) => new UpdateMessageStatusUseCase(messageRepository, logger),
            inject: [MessageRepository, LoggerPort],
        },
    ],
})
export class MessagesModule { }