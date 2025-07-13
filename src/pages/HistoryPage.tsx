import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Trash2, Search, Filter, Eye } from 'lucide-react';
import { ProductList } from '../components/product/ProductList';

import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useHistoryContext } from '../contexts/HistoryContext';
import { useProducts } from '../hooks/useProducts';
import { useToast } from '../hooks/useToast';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  const {
    history,
    historyCount,
    clearHistory,
    removeFromHistory,
    addToHistory,
  } = useHistoryContext();
  const { showSuccess, showInfo } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');

  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [history, searchTerm, dateFilter]);

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

  const handleClearHistory = () => {
    clearHistory();
    showSuccess('Đã xóa toàn bộ lịch sử xem');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    showInfo('Đã đặt lại bộ lọc');
  };

  const statistics = useMemo(() => {
    return {
      totalViews: historyCount,
      uniqueCategories: new Set(history.map((p) => p.category)).size,
      filteredCount: filteredHistory.length,
    };
  }, [history, historyCount, filteredHistory.length]);

  return (
    <>
      <Helmet>
        <title>Trang lịch sử</title>
      </Helmet>
      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-lg">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                  Lịch Sử Xem
                </h1>
                <p className="text-xl text-purple-100 md:text-2xl">
                  Theo dõi hành trình học tập của bạn
                </p>
              </div>
              <div className="hidden md:block">
                <Clock size={80} className="text-white/20" />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {statistics.totalViews}
                </div>
                <div className="text-sm text-purple-100">Lượt xem</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {statistics.uniqueCategories}
                </div>
                <div className="text-sm text-purple-100">Danh mục đã xem</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={handleClearHistory}
            disabled={historyCount === 0}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-pink-600 hover:shadow-lg disabled:opacity-50"
          >
            <Trash2 size={24} />
            <span className="font-medium">Xóa toàn bộ lịch sử</span>
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg"
          >
            <Calendar size={24} />
            <span className="font-medium">Xem hôm nay</span>
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex w-full flex-1 flex-col gap-3 md:flex-row">
              <div className="relative w-full md:flex-[2]">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm trong lịch sử..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-base outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex w-full items-center gap-2 md:flex-[1]">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value as typeof dateFilter)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleResetFilters}
              className="whitespace-nowrap rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Lịch sử ({statistics.filteredCount})
            </h2>
            {searchTerm && (
              <span className="text-sm text-gray-500">
                Kết quả cho "{searchTerm}"
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye size={16} />
            <span>
              Hiển thị {statistics.filteredCount} / {historyCount} mục
            </span>
          </div>
        </div>

        {/* History List */}
        {historyCount === 0 ? (
          <div className="py-12 text-center">
            <Clock size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Chưa có lịch sử xem
            </h3>
            <p className="text-gray-500">
              Khi bạn xem các khóa học, chúng sẽ xuất hiện ở đây
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center">
            <Search size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <ProductList
            products={filteredHistory}
            favorites={favorites}
            onToggleFavorite={handleLike}
            onViewDetails={handleViewDetails}
            emptyMessage="Không tìm thấy khóa học nào trong lịch sử phù hợp với bộ lọc."
          />
        )}
      </div>
    </>
  );
};
