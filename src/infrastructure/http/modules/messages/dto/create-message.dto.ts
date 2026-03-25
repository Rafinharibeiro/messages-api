import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
// Transform é do 'class-transformer', super útil para limpar dados!
import { Transform } from 'class-transformer';


export class CreateMessageDto {

    @ApiProperty({
        example: 'Olá, tudo bem?',
        description: 'Message content',
    })

    @IsString({ message: 'Message content must be a text.' })

    @IsNotEmpty({ message: 'Message content cannot be empty.' })

    @MaxLength(1000, { message: 'Message content cannot be longer than 1000 characters.' })

    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    content: string;

    @ApiProperty({
        example: 'rafael',
        description: 'Message sender',
    })
    @IsString({ message: 'Sender must be a valid text.' })
    @IsNotEmpty({ message: 'Sender is required.' })
    @MaxLength(100, { message: 'Sender name is too long.' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    sender: string;
}
