import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pokemon-favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pokemon-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const toggleFavorite = (pokemonName: string) => {
    setFavorites(prev => {
      if (prev.includes(pokemonName)) {
        return prev.filter(name => name !== pokemonName);
      } else {
        return [...prev, pokemonName];
      }
    });
  };

  const isFavorite = (pokemonName: string) => {
    return favorites.includes(pokemonName);
  };

  const addFavorite = (pokemonName: string) => {
    if (!favorites.includes(pokemonName)) {
      setFavorites(prev => [...prev, pokemonName]);
    }
  };

  const removeFavorite = (pokemonName: string) => {
    setFavorites(prev => prev.filter(name => name !== pokemonName));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
  };
}
