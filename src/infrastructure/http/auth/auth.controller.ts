import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Realizar login e obter JWT' })
    @ApiResponse({ status: 200, description: 'Token gerado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
        return this.authService.login(dto.email, dto.password);
    }
}
