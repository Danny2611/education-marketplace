
import React from 'react';
import { Heart, Star, Users, Clock, Tag } from 'lucide-react';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
  className = ''
}) => {
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
 
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'Beginner': return 'Cơ bản';
      case 'Intermediate': return 'Trung cấp';
      case 'Advanced': return 'Nâng cao';
      default: return level;
    }
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 ${className}`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.isNew && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Mới
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Bán chạy
          </span>
        )}
        {product.discount && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
          isFavorite 
            ? 'bg-white text-red-500 hover:bg-red-50' 
            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
        } hover:scale-110`}
        onClick={handleFavoriteToggle}
        aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Tag size={12} />
          <span>{product.category}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight" title={product.name}>
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="text-sm text-gray-700 mb-3 font-medium">
          Giảng viên: {product.instructor}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="font-medium">{product.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{product.studentsCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{product.duration}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getLevelColor(product.level)}`}>
            {getLevelText(product.level)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(discountedPrice)}
          </span>
          {product.discount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0"
          onClick={handleViewDetails}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};