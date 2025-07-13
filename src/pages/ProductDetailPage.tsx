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
  ArrowLeft
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
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find product by ID from mockProducts
        const foundProduct = mockProducts.find(p => p.id === id);
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

  const getYouTubeEmbedUrl = (url: string): string => {
  const match = url.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy khóa học
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
      </div>
    </div>

    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Video Preview */}
            <div className="relative">
              <div className="aspect-video w-full bg-black relative overflow-hidden">
                {isPlaying ? (
                  <iframe
                    src={getYouTubeEmbedUrl(product.video)}
                    title="YouTube video"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Play size={24} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-lg font-semibold">
                    Mới
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-lg font-semibold">
                    Bán chạy
                  </span>
                )}
                {product.discount && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-lg font-semibold">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-lg text-gray-500 mb-3">
                <Tag size={20} />
                <span>{product.category}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <p className="text-gray-600 mb-6 text-xl leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-amber-500" fill="currentColor" />
                  <span className="font-semibold text-gray-900 text-lg">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-blue-500" />
                  <span className="font-semibold text-gray-900 text-lg">{product.studentsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-green-500" />
                  <span className="font-semibold text-gray-900 text-lg">{product.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-purple-500" />
                  <span className={`px-2 py-1 rounded-full text-lg font-medium ${getLevelColor(product.level)}`}>
                    {getLevelText(product.level)}
                  </span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {product.instructor.charAt(0)}
                </div>
                <div>
                  <p className="text-lg text-gray-500">Giảng viên</p>
                  <p className="font-semibold text-gray-900 text-xl">{product.instructor}</p>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 text-lg ${
                    isFavorite(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600'
                  }`}
                >
                  <Heart size={20} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                  <span className="font-medium">
                    {isFavorite(product.id) ? 'Đã yêu thích' : 'Yêu thích'}
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 text-lg"
                >
                  <Share2 size={20} />
                  <span className="font-medium">Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                  <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                      <div className="flex items-center gap-1 text-amber-500 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <div className="text-lg text-gray-500">({product.studentsCount} đánh giá)</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Sample reviews */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          N
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">Nguyễn Văn A</div>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={18} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg">
                        Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rất rõ ràng. Tôi đã học được rất nhiều kiến thức mới.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          T
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">Trần Thị B</div>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={18} fill="currentColor" />
                            ))}
                            <Star size={18} />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg">
                        Nội dung khóa học phong phú, có nhiều ví dụ thực tế. Tuy nhiên, tôi mong muốn có thêm nhiều bài tập thực hành hơn.
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 text-xl">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatPrice(discountedPrice)}
                  </div>
                  {product.discount && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-lg font-semibold">
                        Tiết kiệm {product.discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard size={20} />
                      Mua ngay
                    </div>
                  </button>
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-gray-100 text-gray-900 py-4 px-6 rounded-lg font-semibold text-xl hover:bg-gray-200 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart size={20} />
                      Thêm vào giỏ
                    </div>
                  </button>
                </div>

                {/* Course Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">Thông tin khóa học:</h3>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-green-500" />
                    <span className="text-gray-700 text-lg">Thời lượng: {product.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-purple-500" />
                    <span className="text-gray-700 text-lg">Trình độ: {getLevelText(product.level)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-blue-500" />
                    <span className="text-gray-700 text-lg">Học viên: {product.studentsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star size={20} className="text-amber-500" />
                    <span className="text-gray-700 text-lg">Đánh giá: {product.rating}/5</span>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">Giảng viên</h4>
                  <p className="text-gray-700 text-lg">{product.instructor}</p>
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