"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PokemonListItem } from "@/types";

// Pokemon with ID already extracted (from parent component)
type PokemonWithId = PokemonListItem & { id: number };

interface PokemonListItemProps {
  pokemon: PokemonWithId;
  isSelected: boolean;
  isFavorite: boolean;
  onClick: () => void;
  index: number;
  onKeyNavigate: (direction: "up" | "down", currentIndex: number) => void;
}

export function PokemonListItemComponent({
  pokemon,
  isSelected,
  isFavorite,
  onClick,
  index,
  onKeyNavigate,
}: PokemonListItemProps) {
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      onKeyNavigate("down", index);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      onKeyNavigate("up", index);
    }
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        layout: { duration: 0.3, type: "spring", bounce: 0.2 },
        opacity: { duration: 0.2 }
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="option"
      tabIndex={0}
      className={cn(
        "w-full flex flex-col gap-2 p-4 rounded-xl text-left transition-all group relative overflow-hidden border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2A7B9B]",
        isSelected
          ? "bg-theme-gradient text-white shadow-lg z-10 border-transparent"
          : isFavorite
            ? "bg-amber-50/80 border-amber-200 text-gray-800 hover:bg-amber-100"
            : "bg-white hover:bg-gray-50 border-transparent hover:border-gray-200 text-gray-700"
      )}
    >
      <div className="flex items-start justify-between z-10">
        <div className="space-y-1">
          <span
            className={cn(
              "text-[11px] font-mono uppercase tracking-wide",
              isSelected ? "text-white/70" : "text-gray-400"
            )}
          >
            #{String(id).padStart(3, "0")}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-semibold capitalize leading-tight">{displayName}</span>
              
          </div>
        </div>
        {isFavorite && (
          <Star
            className={cn(
              "h-4 w-4 z-10 transition-colors duration-200",
              isSelected ? "fill-white text-white" : "fill-amber-400 text-amber-500"
            )}
            aria-label="Favorite Pokémon"
          />
        )}
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/30 border border-white/40 overflow-hidden">
        <div className="h-full bg-theme-gradient" />
      </div>
      {isSelected && (
        <motion.div
          layoutId="selection-highlight"
          className="absolute inset-0 bg-theme-gradient z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          aria-hidden
        />
      )}
    </motion.button>
  );
}

interface PokemonListProps {
  pokemons: PokemonWithId[]; // Expect pokemons with IDs already extracted
  selectedId: number | null;
  favorites: Set<number>; // Set of IDs for fast lookup
  onSelect: (id: number) => void;
}

export function PokemonList({
  pokemons,
  selectedId,
  favorites,
  onSelect,
}: PokemonListProps) {
  // No need to extract IDs - they're already in the pokemons prop
  const items = React.useMemo(() => pokemons, [pokemons]);

  const handleKeyNavigate = (direction: "up" | "down", currentIndex: number) => {
    if (items.length === 0) return;
    if (direction === "down") {
      const next = items[currentIndex + 1] ?? items[0];
      onSelect(next.id);
    } else {
      const prev = items[currentIndex - 1] ?? items[items.length - 1];
      onSelect(prev.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p>No Pokémon found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 pb-4" role="listbox">
      <AnimatePresence mode="popLayout">
        {items.map((pokemon, index) => {
          const id = pokemon.id;
          return (
            <PokemonListItemComponent
              key={pokemon.name}
              pokemon={pokemon}
              index={index}
              isSelected={selectedId === id}
              isFavorite={favorites.has(id)}
              onClick={() => onSelect(id)}
              onKeyNavigate={handleKeyNavigate}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
