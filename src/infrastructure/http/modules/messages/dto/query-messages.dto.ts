import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryMessagesDto {
    @ApiPropertyOptional({
        example: 'rafael',
        description: 'Remetente da mensagem',
    })
    @IsOptional()
    @IsString()
    sender?: string;

    @ApiPropertyOptional({
        example: '2026-03-01T00:00:00.000Z',
        description: 'Data inicial para busca por período',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-03-21T23:59:59.999Z',
        description: 'Data final para busca por período',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}