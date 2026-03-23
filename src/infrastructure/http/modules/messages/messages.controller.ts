import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageUseCase } from '../../../../core/application/message/use-cases/create-message.use-case';
import { GetMessageByIdUseCase } from '../../../../core/application/message/use-cases/get-message-by-id.use-case';
import { SearchMessagesUseCase } from '../../../../core/application/message/use-cases/search-messages.use-case';
import { UpdateMessageStatusUseCase } from '../../../../core/application/message/use-cases/update-message-status.use-case';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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
    @ApiResponse({ status: 201, description: 'Mensagem criada com sucesso' })
    create(@Body() dto: CreateMessageDto) {
        return this.createMessageUseCase.execute(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar mensagem por ID' })
    @ApiResponse({ status: 200, description: 'Mensagem encontrada' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
    findById(@Param('id') id: string) {
        return this.getMessageByIdUseCase.execute(id);
    }

    @Get()
    @ApiOperation({ summary: 'Buscar mensagens por remetente e/ou período' })
    @ApiResponse({ status: 200, description: 'Mensagens encontradas' })
    find(@Query() query: QueryMessagesDto) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;

        return this.searchMessagesUseCase.execute({
            sender: query.sender,
            startDate,
            endDate,
        });
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualizar status da mensagem' })
    @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateMessageStatusDto,
    ) {
        return this.updateMessageStatusUseCase.execute(id, dto.status);
    }

}
