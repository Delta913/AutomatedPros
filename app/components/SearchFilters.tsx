'use client';

import { Search, Filter, Star } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  showFavorites: boolean;
  onFavoritesToggle: () => void;
  favoritesCount: number;
}

export function SearchFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  showFavorites,
  onFavoritesToggle,
  favoritesCount,
}: SearchFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="name">Sort by Name</option>
            <option value="id">Sort by ID</option>
          </select>
        </div>

        {/* Favorites Toggle */}
        <button
          onClick={onFavoritesToggle}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFavorites
              ? 'bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
        >
          <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
          Favorites ({favoritesCount})
        </button>
      </div>
    </div>
  );
}
