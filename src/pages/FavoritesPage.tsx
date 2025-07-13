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
  const {
    favorites,
    toggleFavorite,
    favoritesCount,
    getFavoriteProducts
  } = useFavoritesContext();

  const favoriteProducts = useMemo(
    () => getFavoriteProducts(products),
    [products, favorites]
  );

  const { addToHistory } = useHistoryContext();
  const { showSuccess, showError, showInfo } = useToast();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'dateAdded'>('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  React.useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, sortBy, sortOrder, favoriteProducts]);

  const filteredFavorites = useMemo(() => {
    let filtered = [...favoriteProducts];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      switch (sortBy) {
        case 'name': valueA = a.name.toLowerCase(); valueB = b.name.toLowerCase(); break;
        case 'price': valueA = a.price; valueB = b.price; break;
        case 'rating': valueA = a.rating; valueB = b.rating; break;
        case 'dateAdded': valueA = a.createdAt; valueB = b.createdAt; break;
        default: return 0;
      }

      return sortOrder === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });

    return filtered;
  }, [favoriteProducts, searchTerm, sortBy, sortOrder]);


  const paginatedFavorites = filteredFavorites.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);

  const handleLike = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    toggleFavorite(productId);
    showInfoToast(`Đã xóa "${product.name}" khỏi danh sách yêu thích`);
  };

  const handleViewDetails = (product: any) => {
    addToHistory(product);
    navigate(`/product-detail/${product.id}`);
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedItems(prev =>
      prev.size === filteredFavorites.length
        ? new Set()
        : new Set(filteredFavorites.map(p => p.id))
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
      url: window.location.href
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
    favoriteProducts.forEach(product => {
      stats[product.category] = (stats[product.category] || 0) + 1;
    });
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [favoriteProducts]);

  const averagePrice = useMemo(() => {
    if (favoriteProducts.length === 0) return 0;
    const total = favoriteProducts.reduce((sum, product) => sum + product.price, 0);
    return total / favoriteProducts.length;
  }, [favoriteProducts]);
  return (
    <>
      <Helmet>
            <title>Trang yêu thích</title>
      </Helmet>
       <div className="space-y-6 mt-6">
     {/* Header */}
<div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white rounded-xl p-8 shadow-lg">
  <div className="max-w-4xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
          <Heart size={40} fill="currentColor" />
          Khóa học yêu thích
        </h1>
        <p className="text-xl md:text-2xl text-red-100">
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
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <Share2 size={20} />
          <span className="hidden md:inline">Chia sẻ</span>
        </button>
      </div>
    )}
    </div>

    {/* Statistics */}
    {favoritesCount > 0 && (
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold">{favoritesCount}</div>
          <div className="text-sm text-red-100">Khóa học</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold">{categoryStats.length}</div>
          <div className="text-sm text-red-100">Danh mục</div>
        </div>
      </div>
    )}

   
  </div>
</div>


      {/* Category Distribution */}
      {categoryStats.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Phân bố theo danh mục</h3>
          <div className="space-y-3">
            {categoryStats.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / favoritesCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      {favoritesCount > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Tìm kiếm trong danh sách yêu thích..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="dateAdded">Ngày thêm</option>
                  <option value="name">Tên khóa học</option>
                  <option value="price">Giá</option>
                  <option value="rating">Đánh giá</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {selectedItems.size === filteredFavorites.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>

              {selectedItems.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {favoritesCount === 0 
                ? 'Chưa có khóa học yêu thích' 
                : 'Không tìm thấy khóa học nào'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {favoritesCount === 0 
                ? 'Hãy thêm các khóa học bạn thích để xem chúng tại đây' 
                : 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
              }
            </p>
            {favoritesCount === 0 && (
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
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