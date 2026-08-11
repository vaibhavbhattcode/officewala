'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'office_waala_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnlyMode, setFavoritesOnlyMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const toggleFavorite = useCallback((songId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (songId: string) => favorites.includes(songId),
    [favorites]
  );

  const toggleFavoritesOnlyMode = useCallback(() => {
    setFavoritesOnlyMode((prev) => !prev);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesOnlyMode,
    setFavoritesOnlyMode,
    toggleFavoritesOnlyMode,
    isLoaded,
  };
}
