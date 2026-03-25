import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'api-user@email.com',
        description: 'Email configured in AUTH_EMAIL',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'strong-password',
        description: 'Password configured in AUTH_PASSWORD',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
