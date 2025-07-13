import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Share2 } from 'lucide-react';

import { ProductList } from '../components/product/ProductList';
import { showInfoToast } from '../components/common/Toast/Toast';
import { PaginationControls } from '../components/common/PaginationControls';

import { useProducts } from '../hooks/useProducts';
import { useToast } from '../hooks/useToast';

import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useHistoryContext } from '../contexts/HistoryContext';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();

  const { products } = useProducts();
  const { favorites, toggleFavorite, favoritesCount, getFavoriteProducts } =
    useFavoritesContext();

  const favoriteProducts = useMemo(
    () => getFavoriteProducts(products),
    [products, favorites],
  );

  const { addToHistory } = useHistoryContext();
  const { showSuccess, showError, showInfo } = useToast();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'price' | 'rating' | 'dateAdded'
  >('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, favoriteProducts]);

  const filteredFavorites = useMemo(() => {
    let filtered = [...favoriteProducts];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'rating':
          valueA = a.rating;
          valueB = b.rating;
          break;
        case 'dateAdded':
          valueA = a.createdAt;
          valueB = b.createdAt;
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc'
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
          ? 1
          : -1;
    });

    return filtered;
  }, [favoriteProducts, searchTerm, sortBy, sortOrder]);

  const paginatedFavorites = filteredFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);

  const handleLike = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    toggleFavorite(productId);
    showInfoToast(`Đã xóa "${product.name}" khỏi danh sách yêu thích`);
  };

  const handleViewDetails = (product: any) => {
    addToHistory(product);
    navigate(`/product-detail/${product.id}`);
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.size === filteredFavorites.length
        ? new Set()
        : new Set(filteredFavorites.map((p) => p.id)),
    );
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;
    selectedItems.forEach(toggleFavorite);
    showError(`Đã xóa ${selectedItems.size} khóa học khỏi danh sách yêu thích`);
    setSelectedItems(new Set());
  };

  const handleShareFavorites = () => {
    const shareData = {
      title: 'Danh sách khóa học yêu thích của tôi',
      text: `Tôi có ${favoritesCount} khóa học yêu thích trên EduMarket`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      showSuccess('Đã copy link chia sẻ!');
    }
  };

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    favoriteProducts.forEach((product) => {
      stats[product.category] = (stats[product.category] || 0) + 1;
    });
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [favoriteProducts]);

  const averagePrice = useMemo(() => {
    if (favoriteProducts.length === 0) return 0;
    const total = favoriteProducts.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    return total / favoriteProducts.length;
  }, [favoriteProducts]);
  return (
    <>
      <Helmet>
        <title>Trang yêu thích</title>
      </Helmet>
      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 p-8 text-white shadow-lg">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-4 flex items-center gap-3 text-4xl font-bold md:text-5xl">
                  <Heart size={40} fill="currentColor" />
                  Khóa học yêu thích
                </h1>
                <p className="text-xl text-red-100 md:text-2xl">
                  {favoritesCount === 0
                    ? 'Chưa có khóa học nào trong danh sách yêu thích'
                    : `Bạn có ${favoritesCount} khóa học yêu thích`}
                </p>
              </div>
              {/* Action */}
              {favoritesCount > 0 && (
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={handleShareFavorites}
                    className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/30"
                  >
                    <Share2 size={20} />
                    <span className="hidden md:inline">Chia sẻ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Statistics */}
            {favoritesCount > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{favoritesCount}</div>
                  <div className="text-sm text-red-100">Khóa học</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {categoryStats.length}
                  </div>
                  <div className="text-sm text-red-100">Danh mục</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        {categoryStats.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Phân bố theo danh mục
            </h3>
            <div className="space-y-3">
              {categoryStats.map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-700">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(count / favoritesCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-gray-500">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        {favoritesCount > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              {/* Search and Sort */}
              <div className="flex flex-1 flex-col gap-4 md:flex-row">
                <div className="relative max-w-md flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm trong danh sách yêu thích..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dateAdded">Ngày thêm</option>
                    <option value="name">Tên khóa học</option>
                    <option value="price">Giá</option>
                    <option value="rating">Đánh giá</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Giảm dần</option>
                    <option value="asc">Tăng dần</option>
                  </select>
                </div>
              </div>

              {/* View Mode and Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {selectedItems.size === filteredFavorites.length
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
                </button>

                {selectedItems.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-red-700 transition-colors hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Xóa ({selectedItems.size})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {filteredFavorites.length === 0 ? (
            <div className="py-16 text-center">
              <Heart size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {favoritesCount === 0
                  ? 'Chưa có khóa học yêu thích'
                  : 'Không tìm thấy khóa học nào'}
              </h3>
              <p className="mb-6 text-gray-600">
                {favoritesCount === 0
                  ? 'Hãy thêm các khóa học bạn thích để xem chúng tại đây'
                  : 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'}
              </p>
              {favoritesCount === 0 && (
                <button
                  onClick={() => (window.location.href = '/')}
                  className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
                >
                  Khám phá khóa học
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {filteredFavorites.length} khóa học yêu thích
                  {searchTerm && ` cho "${searchTerm}"`}
                </h2>
              </div>

              <ProductList
                products={paginatedFavorites}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};
