import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MessageStatus } from '../../../../../core/domain/message/enums/message-status.enum';

export class UpdateMessageStatusDto {
    @ApiProperty({
        enum: MessageStatus,
        example: MessageStatus.RECEIVED,
        description: 'Novo status da mensagem',
    })
    @IsEnum(MessageStatus)
    status: MessageStatus;
}