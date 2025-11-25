import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min, IsOptional } from 'class-validator';

export class ListQueryDto {
  @ApiPropertyOptional({
    type: Number,
    example: 30,
    description: 'Number of pokemon to return (capped at 30)',
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  // @Max(30)
  limit?: number = 30;

  @ApiPropertyOptional({ type: Number, example: 0, description: 'Pagination offset', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
