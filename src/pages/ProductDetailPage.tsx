import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Heart,
  Star,
  Users,
  Clock,
  Tag,
  Play,
  Share2,
  Award,
  ShoppingCart,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { Product } from '../types/product';
import { formatPrice } from '../utils/formatters';
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { useToast } from '../hooks/useToast';
import { mockProducts } from '../data/mockData';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>(
    'description',
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find product by ID from mockProducts
        const foundProduct = mockProducts.find((p) => p.id === id);
        setProduct(foundProduct || null);
      } catch (error) {
        showError('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!product) return;

    const wasFavorite = isFavorite(product.id);
    toggleFavorite(product.id);

    if (wasFavorite) {
      showInfo(`Đã xóa "${product.name}" khỏi danh sách yêu thích`);
    } else {
      showSuccess(`Đã thêm "${product.name}" vào danh sách yêu thích`);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Đã sao chép link khóa học');
    }
  };

  const handleEnroll = () => {
    showSuccess('Đã thêm khóa học vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    showSuccess('Chuyển đến trang thanh toán...');
  };

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

  const getYouTubeEmbedUrl = (url: string): string => {
    const match = url.match(/v=([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 h-64 rounded-lg bg-gray-200"></div>
                <div className="mb-2 h-8 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 rounded bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 rounded-lg bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Không tìm thấy khóa học
          </h1>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Calculate price with discount
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <>
      <Helmet>
        <title>Trang chi tiết </title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 text-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Quay lại</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Section */}
              <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-lg">
                {/* Video Preview */}
                <div className="relative">
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {isPlaying ? (
                      <iframe
                        src={getYouTubeEmbedUrl(product.video)}
                        title="YouTube video"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="h-full w-full"
                      ></iframe>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-90 text-gray-900 transition-all duration-200 hover:scale-110 hover:bg-opacity-100"
                        >
                          <Play size={24} fill="currentColor" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="rounded-full bg-green-500 px-3 py-1 text-lg font-semibold text-white">
                        Mới
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-lg font-semibold text-white">
                        Bán chạy
                      </span>
                    )}
                    {product.discount && (
                      <span className="rounded-full bg-red-500 px-3 py-1 text-lg font-semibold text-white">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-lg text-gray-500">
                    <Tag size={20} />
                    <span>{product.category}</span>
                  </div>

                  <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                    {product.name}
                  </h1>

                  <p className="mb-6 text-xl leading-relaxed text-gray-600">
                    {product.shortDescription}
                  </p>

                  {/* Stats */}
                  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Star
                        size={20}
                        className="text-amber-500"
                        fill="currentColor"
                      />
                      <span className="text-lg font-semibold text-gray-900">
                        {product.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-blue-500" />
                      <span className="text-lg font-semibold text-gray-900">
                        {product.studentsCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-green-500" />
                      <span className="text-lg font-semibold text-gray-900">
                        {product.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={20} className="text-purple-500" />
                      <span
                        className={`rounded-full px-2 py-1 text-lg font-medium ${getLevelColor(product.level)}`}
                      >
                        {getLevelText(product.level)}
                      </span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                      {product.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg text-gray-500">Giảng viên</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {product.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-lg font-medium text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleFavoriteToggle}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-lg transition-all duration-200 ${
                        isFavorite(product.id)
                          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                      />
                      <span className="font-medium">
                        {isFavorite(product.id) ? 'Đã yêu thích' : 'Yêu thích'}
                      </span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg text-gray-700 transition-all duration-200 hover:border-blue-500 hover:text-blue-600"
                    >
                      <Share2 size={20} />
                      <span className="font-medium">Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`px-6 py-4 text-lg font-medium transition-colors ${
                        activeTab === 'description'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Mô tả
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`px-6 py-4 text-lg font-medium transition-colors ${
                        activeTab === 'reviews'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Đánh giá
                    </button>
                  </nav>
                </div>

                <div className="p-6 text-xl">
                  {activeTab === 'description' && (
                    <div className="prose prose-gray prose-xl max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.longDescription,
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900">
                            {product.rating}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                fill={
                                  i < Math.floor(product.rating)
                                    ? 'currentColor'
                                    : 'none'
                                }
                              />
                            ))}
                          </div>
                          <div className="text-lg text-gray-500">
                            ({product.studentsCount} đánh giá)
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Sample reviews */}
                        <div className="rounded-lg border border-gray-200 p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-lg font-bold text-white">
                              N
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                Nguyễn Văn A
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={18} fill="currentColor" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-lg text-gray-700">
                            Khóa học rất chi tiết và dễ hiểu. Giảng viên giải
                            thích rất rõ ràng. Tôi đã học được rất nhiều kiến
                            thức mới.
                          </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-bold text-white">
                              T
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                Trần Thị B
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(4)].map((_, i) => (
                                  <Star key={i} size={18} fill="currentColor" />
                                ))}
                                <Star size={18} />
                              </div>
                            </div>
                          </div>
                          <p className="text-lg text-gray-700">
                            Nội dung khóa học phong phú, có nhiều ví dụ thực tế.
                            Tuy nhiên, tôi mong muốn có thêm nhiều bài tập thực
                            hành hơn.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                  <div className="p-6 text-xl">
                    {/* Price */}
                    <div className="mb-6 text-center">
                      <div className="mb-2 text-4xl font-bold text-gray-900">
                        {formatPrice(discountedPrice)}
                      </div>
                      {product.discount && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="rounded-full bg-red-100 px-2 py-1 text-lg font-semibold text-red-800">
                            Tiết kiệm {product.discount}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="mb-6 space-y-3">
                      <button
                        onClick={handleBuyNow}
                        className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard size={20} />
                          Mua ngay
                        </div>
                      </button>
                      <button
                        onClick={handleEnroll}
                        className="w-full rounded-lg border-2 border-gray-200 bg-gray-100 px-6 py-4 text-xl font-semibold text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-200"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <ShoppingCart size={20} />
                          Thêm vào giỏ
                        </div>
                      </button>
                    </div>

                    {/* Course Information */}
                    <div className="space-y-4">
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">
                        Thông tin khóa học:
                      </h3>
                      <div className="flex items-center gap-3">
                        <Clock size={20} className="text-green-500" />
                        <span className="text-lg text-gray-700">
                          Thời lượng: {product.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award size={20} className="text-purple-500" />
                        <span className="text-lg text-gray-700">
                          Trình độ: {getLevelText(product.level)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users size={20} className="text-blue-500" />
                        <span className="text-lg text-gray-700">
                          Học viên: {product.studentsCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star size={20} className="text-amber-500" />
                        <span className="text-lg text-gray-700">
                          Đánh giá: {product.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-2 text-lg font-semibold text-gray-900">
                        Giảng viên
                      </h4>
                      <p className="text-lg text-gray-700">
                        {product.instructor}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
