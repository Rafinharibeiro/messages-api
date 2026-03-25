import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { IsBefore } from 'src/common/decorators/is-before.decorator';

export class QueryMessagesDto {
    @ApiPropertyOptional({
        example: 'john doe',
        description: 'Message sender',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    sender?: string;

    @ApiPropertyOptional({
        example: '2026-03-01T00:00:00.000Z',
        description: 'Start date for period search',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @IsBefore('endDate', { message: 'A data de início não pode ser maior que a data de fim' })
    startDate?: Date;

    @ApiPropertyOptional({
        example: '2026-03-21T23:59:59.999Z',
        description: 'End date for period search',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;
}
