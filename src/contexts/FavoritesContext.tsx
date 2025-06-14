import { createContext, useContext, useEffect, useState } from 'react';
import { addFavorite, getFavorites, removeFavorite } from '@/lib/firebase';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (shortcutId: string) => void;
  isFavorite: (shortcutId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const CURRENT_USER_ID = 1;

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await getFavorites(CURRENT_USER_ID);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleAddFavorite = async (shortcutId: string) => {
    setIsPending(true);

    setFavorites((prev) => [...prev, shortcutId]);

    try {
      await addFavorite(CURRENT_USER_ID, shortcutId);
    } catch (error) {
      console.error('Error adding favorite:', error);

      setFavorites((prev) => prev.filter((id) => id !== shortcutId));
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveFavorite = async (shortcutId: string) => {
    setIsPending(true);

    const previousFavorites = [...favorites];

    setFavorites((prev) => prev.filter((id) => id !== shortcutId));

    try {
      await removeFavorite(CURRENT_USER_ID, shortcutId);
    } catch (error) {
      console.error('Error removing favorite:', error);

      // Rollback on error
      setFavorites(previousFavorites);
    } finally {
      setIsPending(false);
    }
  };

  const toggleFavorite = (shortcutId: string) => {
    if (isPending) {
      return;
    }

    if (favorites.includes(shortcutId)) {
      handleRemoveFavorite(shortcutId);
    } else {
      handleAddFavorite(shortcutId);
    }
  };

  const isFavorite = (shortcutId: string) => {
    return favorites.includes(shortcutId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isLoading: isLoading || isPending,
      }}
    >
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
