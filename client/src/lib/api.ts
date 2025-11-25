import {
  ApiResponse,
  ApiErrorResponse,
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
    // console.log("url", url);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const result: ApiResponse<T> | ApiErrorResponse = await response.json();

    if (!response.ok || !result.success) {
      // Backend returns structured error response
      const errorResponse = result as ApiErrorResponse;
      const errorMessage = Array.isArray(errorResponse.message)
        ? errorResponse.message.join(", ")
        : errorResponse.message || "An unknown error occurred";
      
      const apiError = new Error(errorMessage);
      // Attach error type for better error handling
      (apiError as Error & { errorType?: string }).errorType = errorResponse.error;
      throw apiError;
    }

    return (result as ApiResponse<T>).data;
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
  getPokemonList: (limit = 30, offset = 0) => {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    return fetchClient<PokemonListItem[]>(`/pokemon/list?${params.toString()}`, {
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
