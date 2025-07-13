export interface ToastOptions {
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  description?: string;
}


export interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageInfo: PageInfo;
  message: string;
  success: boolean;
}