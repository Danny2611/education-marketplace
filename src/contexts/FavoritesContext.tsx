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

interface FavoritesContextType {
  favorites: Set<string>;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getFavoriteProducts: (products: Product[]) => Product[];
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.favorites);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error parsing favorites on init:', error);
    }
    return new Set();
  });

  const favoritesCount = favorites.size;

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem(LOCAL_STORAGE_KEYS.favorites);
      if (savedFavorites) {
        try {
          const favoriteIds = JSON.parse(savedFavorites);
          setFavorites(new Set(favoriteIds));
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.favorites,
      JSON.stringify(Array.from(favorites)),
    );
  }, [favorites]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEYS.favorites && e.newValue) {
        try {
          const favoriteIds = JSON.parse(e.newValue);
          setFavorites(new Set(favoriteIds));
        } catch (error) {
          console.error('Error parsing favorites from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites((prev) => new Set(prev).add(productId));
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string): boolean => {
      return favorites.has(productId);
    },
    [favorites],
  );

  const getFavoriteProducts = useCallback(
    (products: Product[]): Product[] => {
      return products.filter((product) => favorites.has(product.id));
    },
    [favorites],
  );

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoriteProducts,
    favoritesCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      'useFavoritesContext must be used within a FavoritesProvider',
    );
  }
  return context;
};
