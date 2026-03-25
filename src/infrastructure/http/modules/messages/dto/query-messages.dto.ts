import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IsBefore } from 'src/common/decorators/is-before.decorator';

export class QueryMessagesDto {
    @ApiPropertyOptional({
        example: 'rafael',
        description: 'Message sender',
    })
    @IsOptional()
    @IsString()
    sender?: string;

    @ApiPropertyOptional({
        example: '2026-03-01T00:00:00.000Z',
        description: 'Start date for period search',
    })
    @ValidateIf((obj) => obj.endDate !== undefined)
    @IsDateString({}, { message: 'Invalid start date format.' })
    @IsBefore('endDate')
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-03-21T23:59:59.999Z',
        description: 'End date for period search',
    })
    @ValidateIf((obj) => obj.startDate !== undefined)
    @IsDateString({}, { message: 'Invalid end date format.' })
    endDate?: string;
}
