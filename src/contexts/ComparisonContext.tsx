import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import { getComparisons, setComparisons, subscribeLocalDb } from "@/lib/localDb";

interface ComparisonContextType {
  comparisonList: string[];
  addToComparison: (propertyId: string) => Promise<void>;
  removeFromComparison: (propertyId: string) => Promise<void>;
  isInComparison: (propertyId: string) => boolean;
  clearComparison: () => Promise<void>;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON = 4;

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchComparison = useCallback(async () => {
    if (!user) {
      // For guest users, use localStorage as fallback
      const stored = localStorage.getItem('comparisonList');
      if (stored) {
        try {
          setComparisonList(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing comparison list:', error);
          setComparisonList([]);
        }
      }
      return;
    }

    try {
      setComparisonList(getComparisons(user.id).slice(0, MAX_COMPARISON));
    } catch (error) {
      console.error('Error fetching comparison list:', error);
      setComparisonList([]);
    }
  }, [user]);

  useEffect(() => {
    fetchComparison();
    const unsub = subscribeLocalDb(fetchComparison);
    return unsub;
  }, [user, fetchComparison]);

  const addToComparison = async (propertyId: string) => {
    if (comparisonList.includes(propertyId)) {
      toast.info("Property already in comparison list");
      return;
    }

    if (comparisonList.length >= MAX_COMPARISON) {
      toast.error(`You can compare up to ${MAX_COMPARISON} properties at once`);
      return;
    }

    if (!user) {
      // For guest users, use localStorage
      const updated = [...comparisonList, propertyId];
      localStorage.setItem('comparisonList', JSON.stringify(updated));
      setComparisonList(updated);
      toast.success("Added to comparison");
      return;
    }

    try {
      // Input validation
      if (!propertyId || !propertyId.trim()) {
        throw new Error('Invalid property ID');
      }
      const current = getComparisons(user.id);
      if (current.includes(propertyId)) {
        toast.info("Property already in comparison list");
        return;
      }
      const next = [...current, propertyId].slice(0, MAX_COMPARISON);
      setComparisons(user.id, next);
      setComparisonList(next);
      toast.success("Added to comparison");
    } catch (error) {
      console.error('Error adding to comparison:', error);
      toast.error('Failed to add to comparison');
    }
  };

  const removeFromComparison = async (propertyId: string) => {
    if (!user) {
      // For guest users, use localStorage
      const updated = comparisonList.filter((id) => id !== propertyId);
      localStorage.setItem('comparisonList', JSON.stringify(updated));
      setComparisonList(updated);
      toast.success("Removed from comparison");
      return;
    }

    try {
      const current = getComparisons(user.id);
      const next = current.filter((id) => id !== propertyId);
      setComparisons(user.id, next);
      setComparisonList(next);
      toast.success("Removed from comparison");
    } catch (error) {
      console.error('Error removing from comparison:', error);
      toast.error('Failed to remove from comparison');
    }
  };

  const isInComparison = (propertyId: string) => {
    return comparisonList.includes(propertyId);
  };

  const clearComparison = async () => {
    if (!user) {
      // For guest users, use localStorage
      localStorage.removeItem('comparisonList');
      setComparisonList([]);
      toast.success("Comparison list cleared");
      return;
    }

    try {
      setComparisons(user.id, []);
      setComparisonList([]);
      toast.success("Comparison list cleared");
    } catch (error) {
      console.error('Error clearing comparison:', error);
      toast.error('Failed to clear comparison');
    }
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
};
