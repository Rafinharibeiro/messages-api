import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'api-user',
        description: 'Usuario configurado em AUTH_USERNAME',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'strong-password',
        description: 'Senha configurada em AUTH_PASSWORD',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
