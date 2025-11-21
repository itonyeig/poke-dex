import { Controller, Get, Param } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ResponseFormatter } from 'src/common/response-formatter';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from './dto/id-param.dto';

@Controller('pokemon')
@ApiTags('Pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('list')
  async getPokemonList() {
    const pokemonList = await this.pokemonService.getPokemonList();
    return ResponseFormatter.Ok({
      data: pokemonList,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Pokemon ID' })
  async getPokemonById(@Param() params: IdParamDto) {
    const pokemon = await this.pokemonService.getPokemonById(params.id);
    return ResponseFormatter.Ok({
      data: pokemon,
    });
  }
}
