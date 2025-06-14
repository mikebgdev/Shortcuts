import { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '@/lib/firebase';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (shortcutId: string) => void;
  isFavorite: (shortcutId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// For now, using a fixed user ID since we don't have authentication
const CURRENT_USER_ID = 1;

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Fetch favorites
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

  // Add favorite
  const handleAddFavorite = async (shortcutId: string) => {
    setIsPending(true);

    // Optimistically update
    setFavorites(prev => [...prev, shortcutId]);

    try {
      await addFavorite(CURRENT_USER_ID, shortcutId);
    } catch (error) {
      console.error('Error adding favorite:', error);

      // Rollback on error
      setFavorites(prev => prev.filter(id => id !== shortcutId));
    } finally {
      setIsPending(false);
    }
  };

  // Remove favorite
  const handleRemoveFavorite = async (shortcutId: string) => {
    setIsPending(true);

    // Store previous state for rollback
    const previousFavorites = [...favorites];

    // Optimistically update
    setFavorites(prev => prev.filter(id => id !== shortcutId));

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
    // Prevent multiple clicks while operation is pending
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
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      isLoading: isLoading || isPending,
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
