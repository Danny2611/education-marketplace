import { NavigationPage } from './navigation';
import {
  PriceRange,
  Product,
  ProductLevel,
  SortOption,
  SortOrder,
} from './product';

export type {
  Product,
  ProductLevel,
  ProductFilters,
  UseProductsReturn,
  PriceRange,
  SortOption,
  SortOrder,
} from './product';
export type {
  ChatMessage,
  ChatBotState,
  UseChatReturn,
  AIResponse,
} from './chat';
export type {
  ToastOptions,
  
} from './common';

export type { NavigationPage, NavigationItem } from './navigation';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

// Event handlers
export interface ProductCardHandlers {
  onLike: (productId: string) => void;
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export interface FilterHandlers {
  onSearchChange: (searchTerm: string) => void;
  onPriceRangeChange: (priceRange: PriceRange) => void;
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: ProductLevel) => void;
  onRatingChange: (rating: number) => void;
  onSortChange: (sortBy: SortOption, order: SortOrder) => void;
  onResetFilters: () => void;
}

// Layout props
export interface HeaderProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
  favoritesCount: number;
  historyCount: number;
}

export interface LayoutProps extends BaseComponentProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

// Error handling
export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}
