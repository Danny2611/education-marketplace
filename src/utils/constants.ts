export const PRICE_RANGES = {
  all: { min: 0, max: Infinity, label: 'Tất cả mức giá' },
  low: { min: 0, max: 500000, label: 'Dưới 500k' },
  medium: { min: 500000, max: 1000000, label: '500k - 1 triệu' },
  high: { min: 1000000, max: Infinity, label: 'Trên 1 triệu' },
};

export const CATEGORIES = [
  'Ngoại ngữ',
  'Lập trình',
  'Marketing',
  'Thiết kế',
  'Khoa học dữ liệu',
  'Nhiếp ảnh',
  'Kinh doanh',
  'Âm nhạc',
  'Sức khỏe',
];

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const CHAT_RESPONSES = {
  greeting:
    'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn tìm khoá học phù hợp. Bạn muốn học gì?',
  error:
    'Xin lỗi, tôi không thể hiểu câu hỏi của bạn. Bạn có thể nói rõ hơn được không?',
  noResults:
    'Tôi không tìm thấy khoá học phù hợp. Bạn có thể thử từ khóa khác không?',
};

export const TOAST_MESSAGES = {
  favoriteAdded: 'Đã thêm vào danh sách yêu thích',
  favoriteRemoved: 'Đã xóa khỏi danh sách yêu thích',
  addToCart: 'Đã thêm vào giỏ hàng',
  error: 'Có lỗi xảy ra, vui lòng thử lại',
};

export const LOCAL_STORAGE_KEYS = {
  favorites: 'edumarket_favorites',
  history: 'edumarket_history',
  preferences: 'edumarket_preferences',
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
