import React, { useState } from 'react';
import { Heart, Clock, Menu, X, Home, Sparkles } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';
import { useHistoryContext } from '../../../contexts/HistoryContext';

const Header: React.FC = () => {
  const { favoritesCount } = useFavoritesContext();
  const { historyCount } = useHistoryContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      id: '/',
      label: 'Trang chủ',
      icon: <Home size={20} />,
      count: undefined,
    },
    {
      id: '/whist-list',
      label: 'Yêu thích',
      icon: <Heart size={20} />,
      count: favoritesCount,
    },
    {
      id: '/history-view',
      label: 'Lịch sử',
      icon: <Clock size={20} />,
      count: historyCount,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-blue-100 bg-white shadow-lg">
      {/* Container with padding sync vs Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2">
              <Sparkles className="h-6 w-6 text-white lg:h-8 lg:w-8" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent lg:text-3xl">
              <Link to="/">EduMarket</Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`relative flex items-center space-x-4 rounded-lg px-4 py-2 text-xl font-medium transition-all duration-200 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700 shadow-md' : 'text-gray-600 hover:text-blue-600'} `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`absolute -right-1 -top-1 flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white`}
                    >
                      {item.count > 99 ? '99+' : item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="rounded-md p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white py-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700 shadow-md' : 'text-gray-600 hover:text-blue-600'} `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`ml-auto flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white`}
                      >
                        {item.count > 99 ? '99+' : item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
