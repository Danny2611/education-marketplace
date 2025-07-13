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
      count: undefined
    },
    {
      id: '/whist-list',
      label: 'Yêu thích',
      icon: <Heart size={20} />,
      count: favoritesCount
    },
    {
      id: '/history-view',
      label: 'Lịch sử',
      icon: <Clock size={20} />,
      count: historyCount
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-40">
      {/* Container with padding sync vs Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Link to="/">
               EduMarket
              </Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`
                    relative flex items-center space-x-4 px-4 py-2 rounded-lg font-medium text-xl
                    transition-all duration-200 hover:bg-blue-50
                    ${isActive ? 'bg-blue-100 text-blue-700 shadow-md' : 'text-gray-600 hover:text-blue-600'}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`
                      absolute -top-1 -right-1 bg-red-500 text-white text-xs
                      rounded-full h-5 w-5 flex items-center justify-center
                      font-bold min-w-[20px] px-1
                    `}>
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
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      relative flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-base
                      transition-all duration-200 hover:bg-blue-50
                      ${isActive ? 'bg-blue-100 text-blue-700 shadow-md' : 'text-gray-600 hover:text-blue-600'}
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`
                        ml-auto bg-red-500 text-white text-xs
                        rounded-full h-5 w-5 flex items-center justify-center
                        font-bold min-w-[20px] px-1
                      `}>
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