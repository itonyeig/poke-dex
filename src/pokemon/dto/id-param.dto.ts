import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ type: Number, example: 1, description: 'Pokemon ID' })
  @Type(() => Number) 
  @IsInt()
  id: number;
}