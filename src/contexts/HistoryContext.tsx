import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Product } from '../types';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
interface HistoryContextType {
  history: Product[];
  historyCount: number;
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
  removeFromHistory: (productId: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({
  children,
}) => {
  const [history, setHistory] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.history);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error parsing history from localStorage:', error);
    }
    return [];
  });

  const historyCount = history.length;

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.history);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('Error loading history from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  // Listen to storage changes across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEYS.history && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setHistory(parsed);
        } catch (error) {
          console.error('Error syncing history from other tab:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToHistory = useCallback((product: Product) => {
    setHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10); // latest 10
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((productId: string) => {
    setHistory((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const value: HistoryContextType = {
    history,
    historyCount,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export const useHistoryContext = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return context;
};
