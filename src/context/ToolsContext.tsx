import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { CalculatorId } from '../types/calculator';

interface ToolsContextValue {
  recentIds: CalculatorId[];
  favoriteIds: CalculatorId[];
  trackRecent: (id: CalculatorId) => void;
  toggleFavorite: (id: CalculatorId) => void;
  isFavorite: (id: CalculatorId) => boolean;
}

const ToolsContext = createContext<ToolsContextValue | null>(null);

const MAX_RECENT = 6;

interface ToolsProviderProps {
  children: React.ReactNode;
}

export function ToolsProvider({ children }: ToolsProviderProps) {
  const [recentIds, setRecentIds] = useState<CalculatorId[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<CalculatorId[]>([]);

  const trackRecent = useCallback((id: CalculatorId) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((item) => item !== id)];
      return next.slice(0, MAX_RECENT);
    });
  }, []);

  const toggleFavorite = useCallback((id: CalculatorId) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const isFavorite = useCallback(
    (id: CalculatorId) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({
      recentIds,
      favoriteIds,
      trackRecent,
      toggleFavorite,
      isFavorite,
    }),
    [recentIds, favoriteIds, trackRecent, toggleFavorite, isFavorite],
  );

  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
}

export function useTools(): ToolsContextValue {
  const ctx = useContext(ToolsContext);
  if (!ctx) {
    throw new Error('useTools must be used within ToolsProvider');
  }
  return ctx;
}
