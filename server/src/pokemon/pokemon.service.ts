import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios, { AxiosInstance } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EvolutionChainLink,
  EvolutionChainResponse,
  EvolutionOption,
  Pokemon,
  PokemonApiResponse,
  PokemonListResponse,
  PokemonResult,
  PokemonSpeciesResponse,
} from './interface/poki-api.interface';
import { FavoritePokemon, FavoritePokemonDocument } from './schema/favorite-pokemon.schema';


@Injectable()
export class PokemonService {
  private readonly pokeAxiosClient: AxiosInstance;
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private readonly CACHE_KEY = 'pokemon-list';
  private readonly CACHE_KEY_POKEMON = 'pokemon';
  private readonly POKEMON_CACHE_TTL = 900000; // 15 minutes in milliseconds

  constructor(
    @InjectModel(FavoritePokemon.name)
    private readonly favoritePokemonModel: Model<FavoritePokemonDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.pokeAxiosClient = axios.create({
      baseURL: this.pokemonApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getPokemonList(limit: number = 150, offset: number = 0): Promise<PokemonResult[] | null> {
    const cacheKey = `${this.CACHE_KEY}-${limit}-${offset}`;
    
    // Try to get from cache first
    const cachedData = await this.cacheManager.get<PokemonResult[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from API
    try {
      const response = await this.pokeAxiosClient.get<PokemonListResponse>(`/?limit=${limit}&offset=${offset}`);
      const data = response.data;
      if (response.status !== 200 || !data) {
        throw new BadRequestException('Failed to get pokemon list');
      }
      
      // Store in cache (TTL is set at module level - 1 day)
      await this.cacheManager.set(cacheKey, data.results);
      
      return data.results;
    } catch (error: any) {
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to fetch data');
    }
  }

  async getPokemonById(id: number, fetchEvolutions: boolean = true): Promise<Pokemon> {
    const evolutionKey = fetchEvolutions ? 'true' : 'false';
    const cacheKey = `${this.CACHE_KEY_POKEMON}-${id}-${evolutionKey}`;
    
    // Try to get from cache first
    const cachedData = await this.cacheManager.get<Pokemon>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from API
    try {
      const response = await this.pokeAxiosClient.get<PokemonApiResponse>(`/${id}/`);
      const data = response.data;
      if (response.status !== 200 || !data) {
        throw new BadRequestException('Failed to get pokemon');
      }
      const evolutions = fetchEvolutions && data.species?.url ? await this.fetchEvolutionOptions(data.species.url, data.name) : [];
      const result = {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => type.type.name),
        abilities: data.abilities.map((ability) => ability.ability.name),
        image: data.sprites.front_default,
        evolutions,
        // stats: data.stats.map((stat) => stat.base_stat),
        // moves: data.moves.map((move) => move.move.name),
        // sprites: data.sprites.front_default,
        // height: data.height,
        // weight: data.weight,
      };
      
      // Store in cache with 15-minute TTL
      await this.cacheManager.set(cacheKey, result, this.POKEMON_CACHE_TTL);
      
      return result;
    }
    catch (error: any) {
      const err = error?.response?.data || error;
      console.error('Error fetching pokemon by id', err);
      throw new BadRequestException(err?.message || 'Failed to fetch pokemon');
    }
  }

  async listFavorites(): Promise<FavoritePokemon[]> {
    return this.favoritePokemonModel.find().sort({ createdAt: -1 }).lean();
  }

  async addFavorite(pokemonId: number): Promise<FavoritePokemon> {
    const fetchEvolutions = false;
    const pokemon = await this.getPokemonById(pokemonId, fetchEvolutions);

    try {
      const favorite = await this.favoritePokemonModel.create({
        pokemonId: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        abilities: pokemon.abilities,
        // evolutions: pokemon.evolutions ?? [],
      } satisfies FavoritePokemon);

      return favorite.toObject();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Pokemon is already in favorites');
      }
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to add favorite');
    }
  }

  async removeFavorite(pokemonId: number): Promise<FavoritePokemon> {
    const deleted = await this.favoritePokemonModel.findOneAndDelete({ pokemonId }).lean();
    if (!deleted) {
      throw new NotFoundException('Pokemon is not in favorites');
    }
    return deleted;
  }

  private async fetchEvolutionOptions(speciesUrl: string, pokemonName: string): Promise<EvolutionOption[]> {
    console.log('fetchEvolutionOptions', speciesUrl, pokemonName);
    try {
      const speciesResponse = await axios.get<PokemonSpeciesResponse>(speciesUrl);
      const evolutionChainUrl = speciesResponse.data?.evolution_chain?.url;
      if (!evolutionChainUrl) {
        return [];
      }
      const chainResponse = await axios.get<EvolutionChainResponse>(evolutionChainUrl);
      const chain = chainResponse.data?.chain;
      if (!chain) {
        return [];
      }
      const targetNode = this.findSpeciesNode(chain, pokemonName.toLowerCase());
      if (!targetNode) {
        return [];
      }
      return this.collectEvolutionOptions(targetNode.evolves_to);
    } catch(error: any) {
      console.error('Error fetching evolution options', error);
      return [];
    }
  }

  private findSpeciesNode(node: EvolutionChainLink, targetName: string): EvolutionChainLink | null {
    if (node.species.name.toLowerCase() === targetName) {
      return node;
    }
    for (const child of node.evolves_to) {
      const found = this.findSpeciesNode(child, targetName);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private collectEvolutionOptions(nodes: EvolutionChainLink[]): EvolutionOption[] {
    const options: EvolutionOption[] = [];
    for (const node of nodes) {
      if (node.evolution_details.length === 0) {
        options.push({
          species: node.species.name,
          trigger: null,
          minLevel: null,
          item: null,
        });
      } else {
        for (const detail of node.evolution_details) {
          options.push({
            species: node.species.name,
            trigger: detail.trigger?.name ?? null,
            minLevel: detail.min_level ?? null,
            item: detail.item?.name ?? null,
          });
        }
      }
      options.push(...this.collectEvolutionOptions(node.evolves_to));
    }
    return options;
  }
}
