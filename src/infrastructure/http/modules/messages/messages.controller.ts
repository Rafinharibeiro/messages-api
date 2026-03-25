import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageUseCase } from '../../../../core/application/message/use-cases/create-message.use-case';
import { GetMessageByIdUseCase } from '../../../../core/application/message/use-cases/get-message-by-id.use-case';
import { SearchMessagesUseCase } from '../../../../core/application/message/use-cases/search-messages.use-case';
import { UpdateMessageStatusUseCase } from '../../../../core/application/message/use-cases/update-message-status.use-case';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { toMessageResponse, toMessageResponseList } from './message.presenter';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly createMessageUseCase: CreateMessageUseCase,
        private readonly getMessageByIdUseCase: GetMessageByIdUseCase,
        private readonly searchMessagesUseCase: SearchMessagesUseCase,
        private readonly updateMessageStatusUseCase: UpdateMessageStatusUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Criar uma nova mensagem' })
    @ApiResponse({ status: 201, description: 'Sucesso', type: MessageResponseDto })
    async create(@Body() dto: CreateMessageDto): Promise<MessageResponseDto> {
        const message = await this.createMessageUseCase.execute(dto);
        return toMessageResponse(message);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar mensagem por ID' })
    @ApiResponse({ status: 200, type: MessageResponseDto })
    @ApiResponse({ status: 404, description: 'Não encontrado' })
    async findById(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<MessageResponseDto> {
        const message = await this.getMessageByIdUseCase.execute(id);
        return toMessageResponse(message);
    }

    @Get()
    @ApiOperation({ summary: 'Listar mensagens com filtros' })
    @ApiResponse({ status: 200, type: [MessageResponseDto] })
    async find(@Query() query: QueryMessagesDto): Promise<MessageResponseDto[]> {
        const messages = await this.searchMessagesUseCase.execute(query);
        return toMessageResponseList(messages);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualizar status (Máquina de Estados)' })
    @ApiResponse({ status: 200, type: MessageResponseDto })
    async updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateMessageStatusDto,
    ): Promise<MessageResponseDto> {
        // Delegamos a validação da transição de status para a Entidade de Domínio
        const message = await this.updateMessageStatusUseCase.execute(id, dto.status);
        return toMessageResponse(message);
    }
}