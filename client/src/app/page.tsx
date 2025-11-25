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
  type PokemonListEntry = PokemonListItem & { id: number };
  const [pokemonList, setPokemonList] = React.useState<PokemonListEntry[]>([]);
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
        const parsedList = listData.map((p) => ({
          ...p,
          id: parseInt(p.url.split("/").filter(Boolean).pop() || "0", 10),
        }));
        setPokemonList(parsedList);
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

    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => {
        return favoriteIds.has(p.id);
      });
    }

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
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#2A7B9B] p-2 rounded-xl shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">PokéDex</p>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Explorer
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            
            <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-gray-700">Favorites</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                {favorites.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 lg:h-[100vh] lg:max-h-[100vh] lg:overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A7B9B]"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,420px)] lg:gap-6 lg:min-h-[70vh] lg:h-full lg:overflow-hidden">
            {/* Left Rail */}
            <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1 lg:row-span-2">
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 sticky top-20">
                <ControlsBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-semibold text-gray-700 text-sm">{pokemonList.length}</p>
                    <p>Total Pokémon</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="font-semibold text-emerald-700 text-sm">{favorites.length}</p>
                    <p>Favorites</p>
                  </div>
                </div>
              </div>
              {/* Mobile detail placement between controls and roster */}
              {selectedId && (
                <div className="lg:hidden bg-white shadow-sm border border-gray-100 rounded-2xl p-2">
                  <PokemonDetailPanel
                    pokemonId={selectedId}
                    isFavorite={favoriteIds.has(selectedId)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              )}
              <div className="hidden lg:block text-xs text-gray-400">
                Use ↑ ↓ to move, Enter to open.
              </div>
            </div>

            {/* Center Lane: Roster */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 flex flex-col lg:h-full lg:overflow-hidden lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Roster</p>
                  <h2 className="text-lg font-semibold text-gray-800">First 150</h2>
                </div>
                <span className="text-xs text-gray-500">
                  Showing {filteredPokemon.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 lg:h-full">
                <PokemonList
                  pokemons={filteredPokemon}
                  selectedId={selectedId}
                  favorites={favoriteIds}
                  onSelect={setSelectedId}
                />
              </div>
            </div>

            {/* Detail: mobile inline between filters and roster; desktop right column */}
            <div
              className={`
                ${selectedId ? "block" : "hidden"}
                lg:block bg-white shadow-sm border border-gray-100 rounded-2xl
                lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:h-full lg:overflow-hidden
              `}
            >
              {selectedId && (
                <PokemonDetailPanel
                  pokemonId={selectedId}
                  isFavorite={favoriteIds.has(selectedId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
              {!selectedId && (
                <div className="hidden lg:block h-full">
                  <PokemonDetailPanel
                    pokemonId={selectedId}
                    isFavorite={false}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
