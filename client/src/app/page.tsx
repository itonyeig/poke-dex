"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { PokemonListItem, FavoritePokemon } from "@/types";
import { PokemonList } from "@/components/PokemonList";
import { PokemonDetailPanel } from "@/components/PokemonDetailPanel";
import { ControlsBar } from "@/components/ControlsBar";
import { Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  // Data State
  const [pokemonList, setPokemonList] = React.useState<PokemonListItem[]>([]);
  const [favorites, setFavorites] = React.useState<FavoritePokemon[]>([]);
  
  // UI State
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  
  // Loading/Error State
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Initial Fetch
  React.useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [listData, favData] = await Promise.all([
          api.getPokemonList(),
          api.getFavorites(),
        ]);
        setPokemonList(listData);
        setFavorites(favData);
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError("Could not load Pokémon data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Derived State
  const favoriteIds = React.useMemo(() => {
    return new Set(favorites.map((f) => f.pokemonId));
  }, [favorites]);

  const filteredPokemon = React.useMemo(() => {
    let filtered = pokemonList;

    // 1. Filter by Favorites (Logic Change: Filter context first)
    // If showFavoritesOnly is true, we start with the favorites list, otherwise all.
    // However, since pokemonList is just the list of 150, and favorites has metadata, 
    // we need to be careful.
    
    // Strategy:
    // If favorites only: Filter the main list to include only those in favorites.
    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => {
        const id = parseInt(p.url.split("/").filter(Boolean).pop() || "0", 10);
        return favoriteIds.has(id);
      });
    }

    // 2. Filter by Search Term (within the current context)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(lowerTerm));
    }

    return filtered;
  }, [pokemonList, searchTerm, showFavoritesOnly, favoriteIds]);

  // Handlers
  const handleToggleFavorite = async (id: number) => {
    try {
      if (favoriteIds.has(id)) {
        // Remove
        await api.removeFavorite(id);
        setFavorites((prev) => prev.filter((f) => f.pokemonId !== id));
      } else {
        // Add
        const newFav = await api.addFavorite(id);
        setFavorites((prev) => [newFav, ...prev]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#2A7B9B] p-1.5 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Poké<span className="text-[#2A7B9B]">Dex</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A7B9B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            
            {/* Left Column: List & Controls */}
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <ControlsBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
              />
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <PokemonList
                  pokemons={filteredPokemon}
                  selectedId={selectedId}
                  favorites={favoriteIds}
                  onSelect={setSelectedId}
                />
              </div>
              
              <div className="text-xs text-gray-400 text-center py-2 border-t border-gray-100">
                Showing {filteredPokemon.length} Pokémon
              </div>
            </div>

            {/* Right Column: Detail Panel */}
            <div className="h-full overflow-hidden sticky top-6">
              <PokemonDetailPanel
                pokemonId={selectedId}
                isFavorite={selectedId ? favoriteIds.has(selectedId) : false}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
