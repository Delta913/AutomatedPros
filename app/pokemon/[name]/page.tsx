'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useFavorites } from '../../hooks/useFavorites';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
}

async function fetchPokemonDetail(name: string, abortSignal?: AbortSignal): Promise<PokemonDetail> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal: abortSignal });
  if (!response.ok) throw new Error('Failed to fetch Pokémon details');
  return response.json();
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pokemonName = params.name as string;
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon-detail', pokemonName],
    queryFn: ({ signal }) => fetchPokemonDetail(pokemonName, signal),
  });

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading Pokémon details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Pokémon
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error?.message || 'Pokémon not found'}
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              data-testid="back-button"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFav = isFavorite(pokemon.name);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          data-testid="back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold capitalize mb-2" data-testid="pokemon-name">
                  {pokemon.name}
                </h1>
                <p className="text-blue-100" data-testid="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</p>
              </div>
              <button
                onClick={() => toggleFavorite(pokemon.name)}
                className={`p-3 rounded-full transition-colors ${
                  isFav
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label={`${isFav ? 'Remove from' : 'Add to'} favorites`}
                data-testid="detail-favorite-button"
              >
                <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex items-center justify-center">
                  <Image
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width={256}
                    height={256}
                    className="w-64 h-64 object-contain"
                    data-testid="pokemon-image"
                  />
                </div>
                
                {/* Types */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Types</h3>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium capitalize"
                        data-testid={`type-${type.type.name}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Height</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="pokemon-height">
                      {pokemon.height / 10}m
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="pokemon-weight">
                      {pokemon.weight / 10}kg
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Base Experience</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="pokemon-exp">
                      {pokemon.base_experience}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="favorites-count">
                      {favorites.length}
                    </p>
                  </div>
                </div>

                {/* Base Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Base Stats</h3>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                            {stat.base_stat}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Abilities</h3>
                  <div className="space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.ability.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-gray-900 dark:text-white capitalize">
                          {ability.ability.name.replace('-', ' ')}
                        </span>
                        {ability.is_hidden && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                            Hidden
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
