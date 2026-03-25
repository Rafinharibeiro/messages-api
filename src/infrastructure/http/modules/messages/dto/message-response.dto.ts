import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from '../../../../../core/domain/message/enums/message-status.enum';

export class MessageResponseDto {
    @ApiProperty({ example: 'f1f7b4e6-1b7a-4f87-9b18-9b8f4c2a9e3a' })
    id: string;

    @ApiProperty({ example: 'Olá, tudo bem?' })
    content: string;

    @ApiProperty({ example: 'rafael' })
    sender: string;

    @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
    sentAt: string;

    @ApiProperty({ enum: MessageStatus, example: MessageStatus.SENT })
    status: MessageStatus;
}
