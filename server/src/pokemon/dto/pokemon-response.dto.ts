import { ApiProperty } from '@nestjs/swagger';

class BaseResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Request was successful' })
  message: string;
}

export class PokemonListItemDto {
  @ApiProperty({ example: 'bulbasaur' })
  name: string;

  @ApiProperty({ example: 'https://pokeapi.co/api/v2/pokemon/1/' })
  url: string;
}

export class EvolutionOptionDto {
  @ApiProperty({ example: 'ivysaur' })
  species: string;

  @ApiProperty({ example: 'level-up', nullable: true })
  trigger: string | null;

  @ApiProperty({ example: 16, nullable: true })
  minLevel: number | null;

  @ApiProperty({ example: 'thunder-stone', nullable: true })
  item: string | null;
}

export class PokemonDetailDto {
  @ApiProperty({ example: 25 })
  id: number;

  @ApiProperty({ example: 'pikachu' })
  name: string;

  @ApiProperty({ type: [String], example: ['electric'] })
  types: string[];

  @ApiProperty({ type: [String], example: ['static', 'lightning-rod'] })
  abilities: string[];

  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  image: string;

  @ApiProperty({ type: [EvolutionOptionDto], required: false })
  evolutions?: EvolutionOptionDto[];
}

export class FavoritePokemonDto {
  @ApiProperty({ example: '65f0a7c8c2d9a1e7b4a12345' })
  _id: string;

  @ApiProperty({ example: 25 })
  pokemonId: number;

  @ApiProperty({ example: 'pikachu' })
  name: string;

  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  image: string;

  @ApiProperty({ type: [String], example: ['electric'] })
  types: string[];

  @ApiProperty({ type: [String], example: ['static', 'lightning-rod'] })
  abilities: string[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}

export class PokemonListResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [PokemonListItemDto], nullable: true })
  data: PokemonListItemDto[] | null;
}

export class PokemonFavoritesResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [FavoritePokemonDto] })
  data: FavoritePokemonDto[];
}

export class PokemonFavoriteResponseDto extends BaseResponseDto {
  @ApiProperty({ type: FavoritePokemonDto })
  data: FavoritePokemonDto;
}

export class PokemonDetailResponseDto extends BaseResponseDto {
  @ApiProperty({ type: PokemonDetailDto })
  data: PokemonDetailDto;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    description: 'Error message or list of validation errors.',
    oneOf: [
      { type: 'string', example: 'Request was not successful' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['pokemonId must be an integer number', 'pokemonId should not be empty'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'BadRequestException' })
  error: string;
}

