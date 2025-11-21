// API Response Shapes
export interface ApiResponse<T> {
  success: boolean;
  message: string | string[];
  data: T;
  error?: string;
}

// Domain Entities
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonEvolution {
  species: string;
  trigger: string;
  minLevel: number | null;
  item: string | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  image: string;
  evolutions: PokemonEvolution[];
}

export interface FavoritePokemon {
  _id: string;
  pokemonId: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  createdAt: string;
  updatedAt: string;
}

// Request Payloads
export interface AddFavoritePayload {
  pokemonId: number;
}

