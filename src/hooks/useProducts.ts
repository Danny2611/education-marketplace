import { useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductFilters,
  SortOption,
  SortOrder,
  UseProductsReturn,
} from '../types';
import { filterProducts } from '../utils/helpers';
import { mockProducts } from '../data/mockData';
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useHistoryContext } from '../contexts/HistoryContext';

const initialFilters: ProductFilters = {
  searchTerm: '',
  priceRange: 'all',
  category: undefined,
  level: undefined,
  rating: undefined,
};

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);

  const { favorites } = useFavoritesContext();
  const { history } = useHistoryContext();

  const sortProducts = useCallback(
    (sortBy: SortOption, order: SortOrder) => {
      const sorted = [...filteredProducts].sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return order === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return order === 'asc' ? valueA - valueB : valueB - valueA;
        }

        if (valueA instanceof Date && valueB instanceof Date) {
          return order === 'asc'
            ? valueA.getTime() - valueB.getTime()
            : valueB.getTime() - valueA.getTime();
        }

        return 0; // fallback
      });

      setFilteredProducts(sorted);
    },
    [filteredProducts],
  );

  const applyFilters = useCallback(() => {
    const filtered = filterProducts(products, filters);
    setFilteredProducts(filtered);
  }, [products, filters]);

  const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, []);

  const getSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Smart suggestions logic based on history and favorites
      const suggestions = getSmartSuggestions(products, history, favorites);
      setFilteredProducts(suggestions);
    } catch (err) {
      setError('Không thể lấy gợi ý lúc này. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [products, history, favorites]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    getSuggestions,
    sortProducts,
  };
};

// Helper function to generate smart suggestions
const getSmartSuggestions = (
  products: Product[],
  history: Product[],
  favorites: Set<string>,
): Product[] => {
  const suggestions: Product[] = [];
  const maxSuggestions = 6;

  // Get categories and levels from favorites and history
  const favoriteProducts = products.filter((p) => favorites.has(p.id));

  const interactedProducts = [...favoriteProducts, ...history];

  // Extract categories and levels from user's interaction
  const preferredCategories = new Set(
    interactedProducts.map((p) => p.category).filter(Boolean),
  );
  const preferredLevels = new Set(
    interactedProducts.map((p) => p.level).filter(Boolean),
  );

  // Priority 1: Products from same categories as favorites (excluding already favorited)
  if (preferredCategories.size > 0) {
    const categoryMatches = products.filter(
      (p) =>
        preferredCategories.has(p.category) &&
        !favorites.has(p.id) &&
        !history.some((h) => h.id === p.id) &&
        p.rating >= 4.0, // High quality products
    );

    // Sort by rating descending
    categoryMatches.sort((a, b) => b.rating - a.rating);
    categoryMatches.slice(0, 3).forEach((p) => {
      if (!suggestions.some((s) => s.id === p.id)) {
        suggestions.push(p);
      }
    });
  }

  // Priority 2: Products with same skill level as viewed products
  if (preferredLevels.size > 0 && suggestions.length < maxSuggestions) {
    const levelMatches = products.filter(
      (p) =>
        preferredLevels.has(p.level) &&
        !favorites.has(p.id) &&
        !history.some((h) => h.id === p.id) &&
        !suggestions.some((s) => s.id === p.id) &&
        p.rating >= 3.5,
    );

    levelMatches.sort((a, b) => b.rating - a.rating);
    levelMatches.slice(0, 2).forEach((p) => {
      if (suggestions.length < maxSuggestions) {
        suggestions.push(p);
      }
    });
  }

  // Priority 3: High-rated products if we still need more
  if (suggestions.length < maxSuggestions) {
    const highRatedProducts = products.filter(
      (p) =>
        p.rating >= 4.5 &&
        !favorites.has(p.id) &&
        !history.some((h) => h.id === p.id) &&
        !suggestions.some((s) => s.id === p.id),
    );

    // Sort by rating and student count
    highRatedProducts.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.studentsCount - a.studentsCount;
    });

    const remaining = maxSuggestions - suggestions.length;
    highRatedProducts.slice(0, remaining).forEach((p) => suggestions.push(p));
  }

  // Fallback: If no history or favorites, return top-rated products
  if (suggestions.length === 0) {
    const topProducts = products
      .filter((p) => p.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    topProducts.forEach((p) => suggestions.push(p));
  }

  return suggestions.slice(0, maxSuggestions);
};
