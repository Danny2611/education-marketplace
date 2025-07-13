import { Product, ProductFilters } from '../types';
import { PRICE_RANGES } from './constants';

export const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter(product => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.instructor.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const range = PRICE_RANGES[filters.priceRange];
      if (product.price < range.min || product.price > range.max) {
        return false;
      }
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Level filter
    if (filters.level && product.level !== filters.level) {
      return false;
    }

    // Rating filter
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }

    return true;
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('tiếng anh') || lowerQuery.includes('english')) {
    return 'Tôi gợi ý khoá "English for Beginners with Native Speakers" - học tiếng Anh với người bản xứ, rất phù hợp cho người mới bắt đầu!';
  }
  if (lowerQuery.includes('lập trình') || lowerQuery.includes('programming')) {
    return 'Bạn có thể tham khảo khoá "Advanced JavaScript Programming" hoặc "Data Science with Python". Cả hai đều rất chất lượng!';
  }
  if (lowerQuery.includes('marketing')) {
    return 'Khoá "Digital Marketing Masterclass" sẽ giúp bạn nắm vững tất cả kỹ năng marketing cần thiết!';
  }
  if (lowerQuery.includes('design') || lowerQuery.includes('thiết kế')) {
    return 'Tôi gợi ý "Web Design with Figma" - học thiết kế web chuyên nghiệp từ cơ bản đến nâng cao!';
  }
  
  return 'Dựa trên yêu cầu của bạn, tôi gợi ý bạn xem qua danh sách khoá học của chúng tôi. Bạn có thể sử dụng chức năng lọc để tìm khoá học phù hợp!';
};

