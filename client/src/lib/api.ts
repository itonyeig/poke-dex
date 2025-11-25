import {
  ApiResponse,
  PokemonListItem,
  PokemonDetail,
  FavoritePokemon,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://poke-be.onrender.com";

/**
 * Generic helper for API requests using fetch.
 * Handles response parsing and error throwing based on the standard API shape.
 */
async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    console.log("url", url);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      // Construct a meaningful error message
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "An unknown error occurred";
      
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    // Re-throw error with a clean message for the UI to consume
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error or invalid JSON response");
  }
}

export const api = {
  /**
   * Fetches the first 150 Pokémon.
   * GET /pokemon/list
   */
  getPokemonList: () => {
    return fetchClient<PokemonListItem[]>("/pokemon/list", {
      method: "GET",
    });
  },

  /**
   * Fetches details for a specific Pokémon by ID.
   * GET /pokemon/:id
   */
  getPokemonDetail: (id: number) => {
    return fetchClient<PokemonDetail>(`/pokemon/${id}`, {
      method: "GET",
    });
  },

  /**
   * Fetches all favorite Pokémon.
   * GET /pokemon/favorites
   */
  getFavorites: () => {
    return fetchClient<FavoritePokemon[]>("/pokemon/favorites", {
      method: "GET",
      cache: "no-store", // Ensure fresh data for user lists
    });
  },

  /**
   * Adds a Pokémon to favorites.
   * POST /pokemon/favorites
   */
  addFavorite: (pokemonId: number) => {
    return fetchClient<FavoritePokemon>("/pokemon/favorites", {
      method: "POST",
      body: JSON.stringify({ pokemonId }),
    });
  },

  /**
   * Removes a Pokémon from favorites.
   * DELETE /pokemon/favorites/:id
   */
  removeFavorite: (pokemonId: number) => {
    return fetchClient<FavoritePokemon>(`/pokemon/favorites/${pokemonId}`, {
      method: "DELETE",
    });
  },
};
