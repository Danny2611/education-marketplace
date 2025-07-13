import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Trash2,
  Search,
  Filter,
  Eye
} from 'lucide-react';
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
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [history, searchTerm, dateFilter]);

  const handleLike = (productId: string) => {
    const product = products.find(p => p.id === productId);
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
      uniqueCategories: new Set(history.map(p => p.category)).size,
      filteredCount: filteredHistory.length
    };
  }, [history, historyCount, filteredHistory.length]);

  return (
    <>
    <Helmet>
        <title>Trang lịch sử</title>
      </Helmet>
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl p-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Lịch Sử Xem</h1>
              <p className="text-xl md:text-2xl text-purple-100">Theo dõi hành trình học tập của bạn</p>
            </div>
            <div className="hidden md:block">
              <Clock size={80} className="text-white/20" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{statistics.totalViews}</div>
              <div className="text-sm text-purple-100">Lượt xem</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{statistics.uniqueCategories}</div>
              <div className="text-sm text-purple-100">Danh mục đã xem</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleClearHistory}
          disabled={historyCount === 0}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Trash2 size={24} />
          <span className="font-medium">Xóa toàn bộ lịch sử</span>
        </button>
        <button
          onClick={() => setDateFilter('today')}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Calendar size={24} />
          <span className="font-medium">Xem hôm nay</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 flex-1 w-full">
            <div className="relative md:flex-[2] w-full">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trong lịch sử..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
              />
            </div>
            <div className="flex items-center gap-2 md:flex-[1] w-full">
              <Filter size={20} className="text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
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
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 whitespace-nowrap"
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
            <span className="text-sm text-gray-500">Kết quả cho "{searchTerm}"</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Eye size={16} />
          <span>Hiển thị {statistics.filteredCount} / {historyCount} mục</span>
        </div>
      </div>

      {/* History List */}
      {historyCount === 0 ? (
        <div className="text-center py-12">
          <Clock size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có lịch sử xem
          </h3>
          <p className="text-gray-500">Khi bạn xem các khóa học, chúng sẽ xuất hiện ở đây</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <Search size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
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
