import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator'; // <-- Importei o IsNotEmpty
import { MessageStatus } from '../../../../../core/domain/message/enums/message-status.enum';

export class UpdateMessageStatusDto {
    @ApiProperty({
        enum: MessageStatus,
        example: MessageStatus.RECEIVED,
        description: 'New message status',
    })
    @IsNotEmpty({ message: 'Status is required.' })
    @IsEnum(MessageStatus, { message: 'Provided status is invalid.' })
    status: MessageStatus;
}
