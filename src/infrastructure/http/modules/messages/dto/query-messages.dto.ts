import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsBefore } from 'src/common/decorators/is-before.decorator';

export class QueryMessagesDto {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @IsBefore('endDate', { message: 'A data de início não pode ser maior que a data de fim' })
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;
}