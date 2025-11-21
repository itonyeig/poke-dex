import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Pokemon, PokemonListResponse, PokemonResult } from './interface/poki-api.interface';


@Injectable()
export class PokemonService {
  private readonly pokeAxiosClient: AxiosInstance;
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor() {
    this.pokeAxiosClient = axios.create({
      baseURL: this.pokemonApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getPokemonList(limit: number = 150, offset: number = 0): Promise<PokemonResult[] | null> {
    try {
      const response = await this.pokeAxiosClient.get<PokemonListResponse>(`/?limit=${limit}&offset=${offset}`);
      const data = response.data;
      if (response.status !== 200 || !data) {
        throw new BadRequestException('Failed to get pokemon list');
      }
      return data.results;
    } catch (error: any) {
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to fetch data');
    }
  }

  async getPokemonById(id: number): Promise<{ id: number, name: string, types: string[], abilities: string[], evolutions?: Pokemon['evolutions'] } | null> {
    try {
      const response = await this.pokeAxiosClient.get<Pokemon>(`/${id}`);
      const data = response.data;
      if (response.status !== 200 || !data) {
        throw new BadRequestException('Failed to get pokemon');
      }
      const result = {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => type.type.name),
        abilities: data.abilities.map((ability) => ability.ability.name),
        evolutions: data.evolutions
        // stats: data.stats.map((stat) => stat.base_stat),
        // moves: data.moves.map((move) => move.move.name),
        // sprites: data.sprites.front_default,
        // height: data.height,
        // weight: data.weight,
      };
      return result;
    }
    catch (error: any) {
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to fetch data');
    }
  }
}
