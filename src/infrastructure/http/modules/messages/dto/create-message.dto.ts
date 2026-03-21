import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
    @ApiProperty({
        example: 'Olá, tudo bem?',
        description: 'Conteúdo da mensagem',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;

    @ApiProperty({
        example: 'rafael',
        description: 'Remetente da mensagem',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    sender: string;
}