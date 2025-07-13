import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { ProductList } from '../components/product/ProductList';
import { ProductFilter } from '../components/product/ProductFilter';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton/LoadingSkeleton';
import { PaginationControls } from '../components/common/PaginationControls';

import { useToast } from '../hooks/useToast';
import { useProducts } from '../hooks/useProducts';

import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useHistoryContext } from '../contexts/HistoryContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    getSuggestions,
    sortProducts,
  } = useProducts();

  const { favorites, toggleFavorite, isFavorite, getFavoriteProducts } =
    useFavoritesContext();
  const favoriteProducts = getFavoriteProducts(products);
  const { addToHistory } = useHistoryContext();
  const { showSuccess, showError, showInfo } = useToast();

  const [sortBy, setSortBy] = useState<
    'name' | 'price' | 'rating' | 'createdAt' | 'studentsCount'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1); // reset trang khi thay đổi filter/sort
  }, [filters, sortBy, sortOrder]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleLike = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const wasFavorite = isFavorite(productId);
    toggleFavorite(productId);

    if (wasFavorite) {
      showInfo(`Đã xóa "${product.name}" khỏi danh sách yêu thích`);
    } else {
      showSuccess(`Đã thêm "${product.name}" vào danh sách yêu thích`);
    }
  };

  const handleViewDetails = (product: any) => {
    addToHistory(product);
    navigate(`/product-detail/${product.id}`);
  };

  const handleGetSuggestions = async () => {
    try {
      await getSuggestions();
      showSuccess('Đã tải gợi ý thành công!');
    } catch (error) {
      showError('Không thể tải gợi ý. Vui lòng thử lại sau.');
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as any);
    sortProducts(newSortBy as any, sortOrder);
    showInfo(
      `Đã sắp xếp theo ${newSortBy} ${sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`,
    );
  };

  const handleSortOrderChange = (newSortOrder: 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
    sortProducts(sortBy, newSortOrder);
    showInfo(
      `Đã sắp xếp theo ${sortBy} ${newSortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`,
    );
  };

  const handleResetFilters = () => {
    resetFilters();
    showInfo('Đã đặt lại bộ lọc');
  };

  const statistics = {
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
    favoriteCount: favoriteProducts.length,
    averageRating:
      products.reduce((sum, p) => sum + p.rating, 0) / products.length,
  };

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <div className="mt-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            onClick={handleGetSuggestions}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white shadow-md transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={24} />
            <span className="font-medium">
              {loading ? 'Đang tải gợi ý...' : 'Gợi ý thông minh'}
            </span>
          </button>

          <button
            onClick={() => {
              setSortBy('rating');
              setSortOrder('desc');
              sortProducts('rating', 'desc');
              showInfo('Đã sắp xếp theo khóa học tốt nhất');
            }}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-md transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg"
          >
            <Star size={24} />
            <span className="font-medium">Khóa học tốt nhất</span>
          </button>

          <button
            onClick={() => {
              setSortBy('createdAt');
              setSortOrder('desc');
              sortProducts('createdAt', 'desc');
              showInfo('Đã sắp xếp theo khóa học mới nhất');
            }}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white shadow-md transition-all duration-200 hover:from-orange-600 hover:to-red-600 hover:shadow-lg"
          >
            <Clock size={24} />
            <span className="font-medium">Khóa học mới nhất</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ProductFilter
                filters={filters}
                onFiltersChange={setFilters}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Khóa học ({statistics.filteredCount})
                </h2>
                {filters.searchTerm && (
                  <span className="text-sm text-gray-500">
                    Kết quả cho "{filters.searchTerm}"
                  </span>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Tên khóa học</option>
                  <option value="price">Giá</option>
                  <option value="rating">Đánh giá</option>
                  <option value="studentsCount">Số học viên</option>
                  <option value="createdAt">Ngày tạo</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) =>
                    handleSortOrderChange(e.target.value as 'asc' | 'desc')
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && <LoadingSkeleton />}

            {/* Product List */}
            {!loading && (
              <>
                <ProductList
                  products={paginatedProducts}
                  favorites={favorites}
                  onToggleFavorite={handleLike}
                  onViewDetails={handleViewDetails}
                  emptyMessage="Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn."
                />

                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
