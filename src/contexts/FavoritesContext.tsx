import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites as getFavoritesForUser, setFavorites as setFavoritesForUser, subscribeLocalDb } from '@/lib/localDb';
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      try {
        const apiFavs = await apiGet<{ propertyId: string }[]>("/favorites");
        setFavorites(apiFavs.map(f => f.propertyId));
        return;
      } catch (apiError) {
        console.warn("Falling back to local favorites:", apiError);
      }

      setFavorites(getFavoritesForUser(user.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
    const unsub = subscribeLocalDb(fetchFavorites);
    return unsub;
  }, [user, fetchFavorites]);

  const addFavorite = async (propertyId: string) => {
    if (!user) {
      throw new Error('You must be logged in to add favorites');
    }

    try {
      // Input validation
      if (!propertyId || !propertyId.trim()) {
        throw new Error('Invalid property ID');
      }

      try {
        await apiPost("/favorites", { propertyId });
        setFavorites(prev =>
          prev.includes(propertyId) ? prev : [...prev, propertyId]
        );
        return;
      } catch (apiError) {
        console.warn("Falling back to local addFavorite:", apiError);
      }

      const current = getFavoritesForUser(user.id);
      if (current.includes(propertyId)) return;
      const next = [...current, propertyId];
      setFavoritesForUser(user.id, next);
      setFavorites(next);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) {
      throw new Error('You must be logged in to remove favorites');
    }

    try {
      try {
        await apiDelete(`/favorites/${propertyId}`);
        setFavorites(prev => prev.filter(id => id !== propertyId));
        return;
      } catch (apiError) {
        console.warn("Falling back to local removeFavorite:", apiError);
      }

      const current = getFavoritesForUser(user.id);
      const next = current.filter((id) => id !== propertyId);
      setFavoritesForUser(user.id, next);
      setFavorites(next);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = async (propertyId: string) => {
    if (isFavorite(propertyId)) {
      await removeFavorite(propertyId);
    } else {
      await addFavorite(propertyId);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
