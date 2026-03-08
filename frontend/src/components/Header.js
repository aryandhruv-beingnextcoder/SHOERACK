import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActivePage = (path) => location.pathname === path;

  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
      setSearchTerm('');
      setMobileSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e, term) => {
    e.preventDefault();
    handleSearch(term);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/60 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-white/70 backdrop-blur-sm shadow-md'
    }`}>
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white text-center py-2 text-sm">
        <span className="animate-pulse">🎉 Free shipping on orders over ₹5000! Limited time offer</span>
      </div>
      
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <img 
              src="/shoeracklogo.png" 
              alt="SHOERACK" 
              className="w-10 h-10 transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12"
            />
            <img 
              src="/shoeracktext.png" 
              alt="SHOERACK" 
              className="h-8 transform group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <form onSubmit={(e) => handleSearchSubmit(e, searchTerm)} className="relative w-full group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for shoes, brands, styles..."
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/70 text-gray-700 placeholder-gray-500 text-sm sm:text-base"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-600 transition-colors duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>



          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {[
              { name: 'Home', path: '/', icon: '🏠' },
              { name: 'Products', path: '/products', icon: '👟' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  isActivePage(item.path)
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50 hover:text-sky-600'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Cart */}
            <Link
              to="/cart"
              className={`relative px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                isActivePage('/cart')
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/50 hover:text-sky-600'
              }`}
            >
              <span className="mr-2">🛒</span>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:from-red-600 hover:to-pink-700 transform hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">⚡</span>
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span>{user.name}</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300 hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 hover:shadow-lg"
              >
                <span className="mr-2">👤</span>
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 animate-fade-in">
            <div className="space-y-3">
              {/* Mobile Search */}
              <form onSubmit={(e) => handleSearchSubmit(e, mobileSearchTerm)} className="relative">
                <input
                  type="text"
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  placeholder="Search shoes..."
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              
              {/* Mobile Navigation Links */}
              {[
                { name: 'Home', path: '/', icon: '🏠' },
                { name: 'Products', path: '/products', icon: '👟' },
                { name: 'Cart', path: '/cart', icon: '🛒' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                >
                  <span>{item.icon}</span>
                  <span className="font-bold text-gray-700">{item.name}</span>
                  {item.name === 'Cart' && cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
              
              {/* Mobile User Actions */}
              {user ? (
                <div className="space-y-2 pt-2 border-t border-gray-200/50">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 bg-purple-500 text-white rounded-xl"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 bg-red-500 text-white rounded-xl"
                    >
                      <span>⚡</span>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold"
                >
                  <span>👤</span>
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;