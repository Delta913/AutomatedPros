'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PokemonList } from './PokemonList';
import { SearchFilters } from './SearchFilters';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

async function fetchPokemonList(offset: number, limit: number, search: string, abortSignal?: AbortSignal): Promise<PokemonListResponse> {
  if (search) {
    // For search, we'll fetch all and filter client-side since PokéAPI doesn't support search
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`, { signal: abortSignal });
    if (!response.ok) throw new Error('Failed to fetch Pokémon');
    const data = await response.json();
    const filtered = data.results.filter((pokemon: Pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    return {
      count: filtered.length,
      next: null,
      previous: null,
      results: filtered.slice(offset, offset + limit)
    };
  }

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`, { signal: abortSignal });
  if (!response.ok) throw new Error('Failed to fetch Pokémon');
  return response.json();
}

export function PokemonExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [showFavorites, setShowFavorites] = useState(searchParams.get('favorites') === 'true');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  const debouncedSearch = useDebounce(search, 300);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const limit = 30;
  const offset = (currentPage - 1) * limit;

  // Update URL when state changes
  useEffect(() => {
    console.log(currentPage);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (sortBy !== 'name') params.set('sort', sortBy);
    if (showFavorites) params.set('favorites', 'true');
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl);
  }, [debouncedSearch, sortBy, showFavorites, currentPage, router]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (debouncedSearch) {
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pokemon', offset, limit, debouncedSearch, showFavorites],
    queryFn: ({ signal }) => fetchPokemonList(offset, limit, debouncedSearch, signal),
    enabled: !showFavorites || favorites.length > 0,
  });

  const filteredAndSortedData = useCallback(() => {
    if (!data?.results) return [];

    let results = showFavorites
      ? data.results.filter(pokemon => isFavorite(pokemon.name))
      : data.results;

    // Sort results
    results = [...results].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return results;
  }, [data?.results, showFavorites, sortBy, isFavorite]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFavoritesToggle = () => {
    setShowFavorites(!showFavorites);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Pokémon
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Loader2 className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Resource Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover and explore Pokémon
          </p>
        </header>

        <SearchFilters
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          showFavorites={showFavorites}
          onFavoritesToggle={handleFavoritesToggle}
          favoritesCount={favorites.length}
        />

        <PokemonList
          data={filteredAndSortedData()}
          isLoading={isLoading}
          currentPage={currentPage}
          totalCount={data?.count || 0}
          limit={limit}
          onPageChange={handlePageChange}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      </div>
    </div>
  );
}
