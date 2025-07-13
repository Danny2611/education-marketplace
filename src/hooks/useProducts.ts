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

      // Mock AI suggestions logic
      const suggestions = products.slice(0, 3);
      setFilteredProducts(suggestions);
    } catch (err) {
      setError('Không thể lấy gợi ý lúc này. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [products]);

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
