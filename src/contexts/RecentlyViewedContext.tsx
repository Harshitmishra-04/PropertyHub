import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getRecentlyViewed as getRecentlyViewedForUser, setRecentlyViewed as setRecentlyViewedForUser, subscribeLocalDb } from "@/lib/localDb";

interface RecentlyViewedContextType {
  recentlyViewed: string[];
  addToRecentlyViewed: (propertyId: string) => Promise<void>;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchRecentlyViewed = useCallback(async () => {
    if (!user) {
      setRecentlyViewed([]);
      return;
    }

    try {
      setRecentlyViewed(getRecentlyViewedForUser(user.id).slice(0, 10));
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
      setRecentlyViewed([]);
    }
  }, [user]);

  useEffect(() => {
    fetchRecentlyViewed();
    const unsub = subscribeLocalDb(fetchRecentlyViewed);
    return unsub;
  }, [user, fetchRecentlyViewed]);

  const addToRecentlyViewed = async (propertyId: string) => {
    if (!user) {
      // For guest users, store in localStorage as fallback
      const stored = localStorage.getItem('recentlyViewed');
      const storedList = stored ? JSON.parse(stored) : [];
      const filtered = storedList.filter((id: string) => id !== propertyId);
      const updated = [propertyId, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      setRecentlyViewed(updated);
      return;
    }

    try {
      // Input validation
      if (!propertyId || !propertyId.trim()) {
        throw new Error('Invalid property ID');
      }
      const current = getRecentlyViewedForUser(user.id);
      const filtered = current.filter((id) => id !== propertyId);
      const next = [propertyId, ...filtered].slice(0, 10);
      setRecentlyViewedForUser(user.id, next);
      setRecentlyViewed(next);
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
      throw error;
    }
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
};
