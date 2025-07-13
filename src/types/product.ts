export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  video: string;
  shortDescription: string;
  longDescription: string;
  instructor: string;
  category: string;
  rating: number;
  studentsCount: number;
  duration: string;
  level: ProductLevel;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  discount?: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

export type ProductLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ProductFilters {
  searchTerm: string;
  priceRange: PriceRange;
  category?: string;
  level?: ProductLevel;
  rating?: number;
  sortBy?: SortOption;
  sortOrder?: SortOrder;
}

export type PriceRange = 'all' | 'low' | 'medium' | 'high';
export type SortOption =
  | 'name'
  | 'price'
  | 'rating'
  | 'studentsCount'
  | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  getSuggestions: () => Promise<void>;
  sortProducts: (sortBy: SortOption, order: SortOrder) => void;
}
