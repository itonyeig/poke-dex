"use client";

import * as React from "react";
import { Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function ControlsBar({
  searchTerm,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavorites,
}: ControlsBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={showFavoritesOnly ? "Search Favorites..." : "Search Pokémon..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7B9B]/20 focus:border-[#2A7B9B] transition-all placeholder:text-gray-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
        />
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggleFavorites}
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]",
          showFavoritesOnly
            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        )}
      >
        <Star
          className={cn(
            "h-4 w-4 transition-colors",
            showFavoritesOnly ? "fill-yellow-500 text-yellow-500" : "text-gray-400"
          )}
        />
        <span>Favorites Only</span>
      </motion.button>
    </div>
  );
}
