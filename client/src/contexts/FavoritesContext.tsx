import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (shortcutId: number) => void;
  isFavorite: (shortcutId: number) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// For now, using a fixed user ID since we don't have authentication
const CURRENT_USER_ID = 1;

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  
  const { data: favorites = [], isLoading } = useQuery<number[]>({
    queryKey: ['/api/favorites', CURRENT_USER_ID],
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (shortcutId: number) => {
      const response = await fetch(`/api/favorites`, {
        method: 'POST',
        body: JSON.stringify({ userId: CURRENT_USER_ID, shortcutId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to add favorite');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', CURRENT_USER_ID] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (shortcutId: number) => {
      const response = await fetch(`/api/favorites/${CURRENT_USER_ID}/${shortcutId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', CURRENT_USER_ID] });
    },
  });

  const toggleFavorite = (shortcutId: number) => {
    // Prevent multiple clicks while mutation is pending
    if (addFavoriteMutation.isPending || removeFavoriteMutation.isPending) {
      return;
    }
    
    if (favorites.includes(shortcutId)) {
      removeFavoriteMutation.mutate(shortcutId);
    } else {
      addFavoriteMutation.mutate(shortcutId);
    }
  };

  const isFavorite = (shortcutId: number) => {
    return favorites.includes(shortcutId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      isLoading: isLoading || addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}