import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty({ type: Number, example: 25, description: 'Pokemon ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pokemonId: number;
}

