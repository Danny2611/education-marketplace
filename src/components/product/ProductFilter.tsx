import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { ProductFilters, ProductLevel, PriceRange, SortOption, SortOrder } from '../../types/product';
import { CATEGORIES, LEVELS } from '../../utils/constants';

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  onResetFilters: () => void;
  className?: string;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  className = ''
}) => {
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchTerm: e.target.value });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category: category === 'all' ? undefined : category });
  };

  const handleLevelChange = (level: string) => {
    onFiltersChange({ level: level === 'all' ? undefined : level as ProductLevel });
  };

  const handlePriceRangeChange = (priceRange: PriceRange) => {
    onFiltersChange({ priceRange });
  };

  const handleSortChange = (sortBy: SortOption, sortOrder: SortOrder) => {
    onFiltersChange({ sortBy, sortOrder });
  };

  const priceRanges = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: 'low', label: 'Dưới 500k' },
    { value: 'medium', label: '500k - 1 triệu' },
    { value: 'high', label: 'Trên 1 triệu' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h3 className="text-2xl font-bold text-gray-900">Bộ lọc</h3>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-3 text-xl bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter size={20} />
          {showMobileFilters ? 'Ẩn' : 'Hiện'} bộ lọc
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden'} md:block`}>
        {/* Category Filter */}
        <div>
          <label className="block text-xl font-semibold text-gray-900 mb-3">Danh mục</label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all "
          >
            <option value="all">Tất cả danh mục</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category} >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-xl font-semibold text-gray-900 mb-3">Cấp độ</label>
          <select
            value={filters.level || 'all'}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">Tất cả cấp độ</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level === 'Beginner' ? 'Cơ bản' : level === 'Intermediate' ? 'Trung cấp' : 'Nâng cao'}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-xl font-semibold text-gray-900 mb-3">Mức giá</label>
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={filters.priceRange === range.value}
                  onChange={(e) => handlePriceRangeChange(e.target.value as PriceRange)}
                  className="mr-3 scale-125"
                />
                <span className="text-xl text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-600 transition-colors"
        >
          <RotateCcw size={20} />
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  );
};
