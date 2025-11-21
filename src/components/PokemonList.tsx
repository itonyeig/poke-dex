"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PokemonListItem } from "@/types";

interface PokemonListItemProps {
  pokemon: PokemonListItem;
  isSelected: boolean;
  isFavorite: boolean;
  onClick: () => void;
  index: number;
}

export function PokemonListItemComponent({
  pokemon,
  isSelected,
  isFavorite,
  onClick,
  index,
}: PokemonListItemProps) {
  // Capitalize first letter
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  // Extract ID from URL
  const id = pokemon.url.split("/").filter(Boolean).pop();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all group relative overflow-hidden",
        isSelected
          ? "bg-theme-gradient text-white shadow-md z-10"
          : "bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-700"
      )}
    >
      <div className="flex items-center gap-3 z-10">
        <span className={cn(
          "text-xs font-mono opacity-50",
          isSelected ? "text-white/70" : "text-gray-400"
        )}>
          #{String(id).padStart(3, '0')}
        </span>
        <span className="font-medium capitalize">{displayName}</span>
      </div>

      {isFavorite && (
        <Star
          className={cn(
            "h-4 w-4 z-10",
            isSelected ? "fill-white text-white" : "fill-yellow-400 text-yellow-400"
          )}
        />
      )}
      
      {isSelected && (
        <motion.div
          layoutId="selection-highlight"
          className="absolute inset-0 bg-theme-gradient -z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

interface PokemonListProps {
  pokemons: PokemonListItem[];
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
  if (pokemons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p>No Pokémon found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-4">
      {pokemons.map((pokemon, index) => {
        const id = parseInt(pokemon.url.split("/").filter(Boolean).pop() || "0", 10);
        return (
          <PokemonListItemComponent
            key={pokemon.name}
            pokemon={pokemon}
            index={index}
            isSelected={selectedId === id}
            isFavorite={favorites.has(id)}
            onClick={() => onSelect(id)}
          />
        );
      })}
    </div>
  );
}
