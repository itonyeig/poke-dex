"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, Zap, Loader2 } from "lucide-react";
import { PokemonDetail } from "@/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PokemonDetailPanelProps {
  pokemonId: number | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => Promise<void>;
}

export function PokemonDetailPanel({
  pokemonId,
  isFavorite,
  onToggleFavorite,
}: PokemonDetailPanelProps) {
  const [pokemon, setPokemon] = React.useState<PokemonDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = React.useState(false);

  React.useEffect(() => {
    if (!pokemonId) {
      setPokemon(null);
      return;
    }

    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getPokemonDetail(pokemonId);
        if (isMounted) setPokemon(data);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load Pokémon details. Please try again.");
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [pokemonId]);

  const handleFavoriteClick = async () => {
    if (!pokemon) return;
    try {
      setIsFavoriteLoading(true);
      await onToggleFavorite(pokemon.id);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (!pokemonId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <Zap className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">Select a Pokémon</p>
        <p className="text-sm opacity-70">View details and stats here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full min-h-[500px] relative">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Skeleton Header */}
              <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-gray-50/50">
                 <Skeleton className="h-4 w-16 mb-2" />
                 <Skeleton className="h-8 w-48 mb-4" />
                 <Skeleton className="w-40 h-40 rounded-full mb-4" />
                 <div className="flex gap-2">
                   <Skeleton className="h-6 w-16 rounded-full" />
                   <Skeleton className="h-6 w-16 rounded-full" />
                 </div>
              </div>
              {/* Skeleton Details */}
              <div className="p-6 space-y-6">
                 <div className="space-y-3">
                   <Skeleton className="h-4 w-24" />
                   <div className="flex gap-2">
                     <Skeleton className="h-8 w-24 rounded-lg" />
                     <Skeleton className="h-8 w-24 rounded-lg" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-16 w-full rounded-xl" />
                 </div>
              </div>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-8 text-center"
          >
            <div className="text-blue-700">
              <p className="font-medium mb-2">Oops!</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        ) : pokemon ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* Header Section - Name/ID above image */}
            <div className="relative bg-gradient-to-b from-gray-50 to-white p-6 flex flex-col items-center border-b border-gray-100">
              {/* Favorite Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavoriteClick}
                  disabled={isFavoriteLoading}
                  className={cn(
                    "p-2 rounded-full transition-all shadow-sm border relative overflow-hidden",
                    isFavorite 
                      ? "bg-yellow-50 border-yellow-200 text-yellow-500" 
                      : "bg-white border-gray-200 text-gray-300 hover:text-gray-400 hover:bg-gray-50"
                  )}
                >
                   {isFavoriteLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-[#2A7B9B]" />
                   ) : (
                      <Star className={cn("h-6 w-6", isFavorite && "fill-current")} />
                   )}
                </motion.button>
              </div>

              {/* Name and ID */}
              <div className="text-center mb-4">
                <span className="text-sm font-mono text-gray-400 mb-1 block">#{String(pokemon.id).padStart(3, '0')}</span>
                <h2 className="text-3xl font-bold text-gray-800 capitalize mb-3">{pokemon.name}</h2>
                <div className="flex gap-2 justify-center">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 hover:bg-white hover:shadow-sm hover:border-[#2A7B9B]/30 hover:text-[#2A7B9B] transition-all duration-200 cursor-default"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="relative z-10"
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-40 h-40 object-contain drop-shadow-xl"
                />
              </motion.div>
            </div>

            {/* Details Section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Abilities */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Abilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 capitalize hover:bg-blue-100 transition-colors duration-200"
                    >
                      {ability.replace('-', ' ')}
                    </div>
                  ))}
                </div>
              </section>

              {/* Evolutions */}
              {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> Evolutions
                  </h3>
                  <div className="space-y-3">
                    {pokemon.evolutions.map((evo, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm hover:border-blue-100 transition-all duration-200"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 capitalize">{evo.species}</span>
                          <span className="text-xs text-gray-400 capitalize">
                            Via {evo.trigger.replace('-', ' ')}
                            {evo.minLevel && ` (Lvl ${evo.minLevel})`}
                            {evo.item && ` + ${evo.item.replace('-', ' ')}`}
                          </span>
                        </div>
                        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-[#2A7B9B] font-bold">
                          <span className="text-xs">{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
