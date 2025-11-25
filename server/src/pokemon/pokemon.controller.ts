import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ResponseFormatter } from 'src/common/response-formatter';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IdParamDto } from './dto/id-param.dto';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { ListQueryDto } from './dto/list-query.dto';
import {
  ApiErrorResponseDto,
  PokemonDetailResponseDto,
  PokemonFavoriteResponseDto,
  PokemonFavoritesResponseDto,
  PokemonListResponseDto,
} from './dto/pokemon-response.dto';

@Controller('pokemon')
@ApiTags('Pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('list')
  @ApiOkResponse({
    description: 'Returns the default list of Pokémon fetched from PokeAPI.',
    type: PokemonListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Input parameters are invalid or the upstream API failed.',
    type: ApiErrorResponseDto,
  })
  async getPokemonList(@Query() query: ListQueryDto) {
    const pokemonList = await this.pokemonService.getPokemonList(query.limit, query.offset);
    return ResponseFormatter.Ok({
      data: pokemonList,
    });
  }

  @Get('favorites')
  @ApiOkResponse({
    description: 'Returns all Pokémon saved to favorites.',
    type: PokemonFavoritesResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Unable to query favorites.',
    type: ApiErrorResponseDto,
  })
  async listFavorites() {
    const favorites = await this.pokemonService.listFavorites();
    return ResponseFormatter.Ok({
      data: favorites,
    });
  }

  @Post('favorites')
  @ApiBody({ type: AddFavoriteDto })
  @ApiOkResponse({
    description: 'Pokemon added to favorites successfully.',
    type: PokemonFavoriteResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payload validation failed.',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Pokemon already exists in favorites.',
    type: ApiErrorResponseDto,
  })
  async addFavorite(@Body() payload: AddFavoriteDto) {
    const favorite = await this.pokemonService.addFavorite(payload.pokemonId);
    return ResponseFormatter.Ok({
      data: favorite,
      message: 'Pokemon added to favorites',
    });
  }

  @Delete('favorites/:id')
  @ApiParam({ name: 'id', type: Number, description: 'Pokemon ID' })
  @ApiOkResponse({
    description: 'Pokemon removed from favorites successfully.',
    type: PokemonFavoriteResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Pokemon id.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Pokemon was not found in favorites.',
    type: ApiErrorResponseDto,
  })
  async removeFavorite(@Param() params: IdParamDto) {
    const favorite = await this.pokemonService.removeFavorite(params.id);
    return ResponseFormatter.Ok({
      data: favorite,
      message: 'Pokemon removed from favorites',
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Pokemon ID' })
  @ApiOkResponse({
    description: 'Returns detailed information for the requested Pokemon.',
    type: PokemonDetailResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Pokemon data could not be retrieved.',
    type: ApiErrorResponseDto,
  })
  async getPokemonById(@Param() params: IdParamDto) {
    const pokemon = await this.pokemonService.getPokemonById(params.id);
    return ResponseFormatter.Ok({
      data: pokemon,
    });
  }
}
