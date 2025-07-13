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
  className = '',
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
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'Cơ bản';
      case 'Intermediate':
        return 'Trung cấp';
      case 'Advanced':
        return 'Nâng cao';
      default:
        return level;
    }
  };

  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Mới
          </span>
        )}
        {product.isBestseller && (
          <span className="rounded-full bg-amber-500 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Bán chạy
          </span>
        )}
        {product.discount && (
          <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
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
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          <Tag size={12} />
          <span>{product.category}</span>
        </div>

        <h3
          className="mb-2 line-clamp-2 text-lg font-semibold leading-tight text-gray-900"
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {product.shortDescription}
        </p>

        <div className="mb-3 text-sm font-medium text-gray-700">
          Giảng viên: {product.instructor}
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
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
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium uppercase tracking-wider ${getLevelColor(product.level)}`}
          >
            {getLevelText(product.level)}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2">
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
          onClick={handleViewDetails}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};
