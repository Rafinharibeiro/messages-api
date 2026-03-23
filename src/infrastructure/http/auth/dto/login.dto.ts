import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'api-user@email.com',
        description: 'Email configurado em AUTH_EMAIL',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'strong-password',
        description: 'Senha configurada em AUTH_PASSWORD',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
