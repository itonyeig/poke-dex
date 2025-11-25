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
  scrollable?: boolean;
  hideDetails?: boolean;
  compactActions?: boolean;
}

export function PokemonDetailPanel({
  pokemonId,
  isFavorite,
  onToggleFavorite,
  scrollable = true,
  hideDetails = false,
  compactActions = false,
}: PokemonDetailPanelProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [pokemon, setPokemon] = React.useState<PokemonDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = React.useState(false);
  const [mobileSection, setMobileSection] = React.useState<"none" | "overview" | "abilities" | "evolutions">("none");

  React.useEffect(() => {
    // Smooth scroll to top of the detail panel when a new Pokémon is selected
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileSection("none");
  }, [pokemonId]);

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
    if (!pokemon || isFavoriteLoading) return; // Prevent double-clicks
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
    <div
      ref={panelRef}
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 h-full relative flex flex-col",
        hideDetails ? "min-h-[300px]" : "min-h-[500px]",
        scrollable ? "overflow-y-auto custom-scrollbar" : "overflow-hidden"
      )}
    >
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
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-[#2A7B9B]/10 via-white to-emerald-50 p-6 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">
                    #{String(pokemon.id).padStart(3, "0")}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 capitalize mb-2">{pokemon.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/80 text-gray-700 border border-gray-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavoriteClick}
                  disabled={isFavoriteLoading}
                  className={cn(
                    "p-3 rounded-2xl transition-all shadow-sm border relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2A7B9B]",
                    isFavorite
                      ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                      : "bg-white border-gray-200 text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                  )}
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavoriteLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#2A7B9B]" />
                  ) : (
                    <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  )}
                </motion.button>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 200 }}
                className="mt-4 flex justify-center"
              >
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain drop-shadow-xl"
                  />
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Mobile compact actions */}
              {hideDetails && compactActions && (
                <div className="flex gap-2">
                  {(["overview", "abilities", "evolutions"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobileSection((prev) => (prev === tab ? "none" : tab))}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                        mobileSection === tab
                          ? "bg-[#2A7B9B] text-white border-transparent shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {tab === "overview" ? "Overview" : tab === "abilities" ? "Abilities" : "Evolutions"}
                    </button>
                  ))}
                </div>
              )}

              {/* Default (desktop/full) details */}
              {!hideDetails && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Types</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">
                        {pokemon.types.join(", ")}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Abilities</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {pokemon.abilities.length}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Evolutions</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {pokemon.evolutions?.length ?? 0}
                      </p>
                    </div>
                  </div>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Abilities
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pokemon.abilities.map((ability) => (
                        <div
                          key={ability}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 capitalize hover:bg-blue-100 transition-colors duration-200"
                        >
                          {ability.replace("-", " ")}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" /> Evolutions
                    </h3>
                    <div className="mt-3 space-y-3">
                      {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
                        pokemon.evolutions.map((evo, idx) => {
                          const triggerLabel = evo.trigger ? evo.trigger.replace("-", " ") : "Unknown";
                          const itemLabel = evo.item ? ` + ${evo.item.replace("-", " ")}` : "";
                          const minLevel = evo.minLevel ? ` (Lvl ${evo.minLevel})` : "";
                          return (
                            <div
                              key={`${evo.species}-${idx}`}
                              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm hover:border-blue-100 transition-all duration-200"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700 capitalize">{evo.species}</span>
                                <span className="text-xs text-gray-500 capitalize">
                                  Via {triggerLabel}
                                  {minLevel}
                                  {itemLabel}
                                </span>
                              </div>
                              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-[#2A7B9B] font-bold">
                                <span className="text-xs">{idx + 1}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500">
                          No evolution data available.
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}

              {/* Mobile compact content */}
              {hideDetails && compactActions && mobileSection !== "none" && (
                <div className="space-y-4">
                  {mobileSection === "overview" && (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Types</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {pokemon.types.join(", ")}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Abilities</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {pokemon.abilities.length}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Evolutions</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {pokemon.evolutions?.length ?? 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {mobileSection === "abilities" && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Abilities
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pokemon.abilities.map((ability) => (
                          <div
                            key={ability}
                            className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-100 capitalize"
                          >
                            {ability.replace("-", " ")}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {mobileSection === "evolutions" && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" /> Evolutions
                      </h3>
                      <div className="mt-3 space-y-3">
                        {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
                          pokemon.evolutions.map((evo, idx) => {
                            const triggerLabel = evo.trigger ? evo.trigger.replace("-", " ") : "Unknown";
                            const itemLabel = evo.item ? ` + ${evo.item.replace("-", " ")}` : "";
                            const minLevel = evo.minLevel ? ` (Lvl ${evo.minLevel})` : "";
                            return (
                              <div
                                key={`${evo.species}-${idx}`}
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-700 capitalize">{evo.species}</span>
                                  <span className="text-xs text-gray-500 capitalize">
                                    Via {triggerLabel}
                                    {minLevel}
                                    {itemLabel}
                                  </span>
                                </div>
                                <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center border border-gray-100 text-[#2A7B9B] font-bold">
                                  <span className="text-[11px]">{idx + 1}</span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500">
                            No evolution data available.
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
