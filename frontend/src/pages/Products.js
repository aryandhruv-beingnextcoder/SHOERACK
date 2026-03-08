import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  });
  const [searchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    setFilters(prev => ({ ...prev, search, category }));
    fetchBrands();
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/users/wishlist');
      setWishlist(response.data.map(item => item._id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (productId, e) => {
    console.log('❤️ Like button clicked!', productId);
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to wishlist', {
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          color: '#2563eb',
          fontWeight: '600',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      });
      return;
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        await api.delete(`/users/wishlist/${productId}`);
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success('❤️ Removed from wishlist', {
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            color: '#dc2626',
            fontWeight: '600',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        });
      } else {
        await api.post(`/users/wishlist/${productId}`);
        setWishlist(prev => [...prev, productId]);
        toast.success('💖 Added to wishlist!', {
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '16px',
            color: '#16a34a',
            fontWeight: '600',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist', {
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          color: '#dc2626',
          fontWeight: '600',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      });
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Clear search params when search filter is cleared
  useEffect(() => {
    if (!filters.search && searchParams.get('search')) {
      // Remove search param from URL when search is cleared
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('search');
      window.history.replaceState({}, '', `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`);
    }
  }, [filters.search, searchParams]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchProducts();
      // Scroll to top when filters change (except for initial load)
      if (filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, filters.search ? 300 : 0); // 300ms delay for search, immediate for other filters

    return () => clearTimeout(timeoutId);
  }, [filters]);



  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/products?${queryParams}`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const filterValue = value === 'All Brands' || value === 'All Categories' || value === '' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: filterValue }));
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up lg:sticky lg:top-8">
              <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🔍</span>
                  </div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Filters</h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-300/30 rounded-xl text-red-600 hover:from-red-500 hover:to-pink-500 hover:text-white text-sm font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  ✨ Clear All
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-bold mb-4 text-gray-800">
                    <span className="text-lg">🔎</span>
                    <span>Search Products</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Type to search..."
                      className="w-full px-6 py-4 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-2 border-sky-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/30 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-lg hover:shadow-xl group-hover:border-sky-300"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-400 group-hover:text-sky-600 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-bold mb-4 text-gray-800">
                    <span className="text-lg">📂</span>
                    <span>Category</span>
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-2 border-sky-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/30 focus:border-sky-400 transition-all duration-300 text-gray-800 shadow-lg hover:shadow-xl cursor-pointer group-hover:border-sky-300"
                  >
                    <option value="">🌟 All Categories</option>
                    <option value="Sneakers">👟 Sneakers</option>
                    <option value="Formal">👞 Formal Shoes</option>
                    <option value="Sports">⚡ Sports Shoes</option>
                    <option value="Casual">👕 Casual Wear</option>
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-bold mb-4 text-gray-800">
                    <span className="text-lg">🏷️</span>
                    <span>Brand</span>
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-2 border-sky-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/30 focus:border-sky-400 transition-all duration-300 text-gray-800 shadow-lg hover:shadow-xl cursor-pointer group-hover:border-sky-300"
                  >
                    <option value="">✨ All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand._id || brand.name} value={brand.name}>
                        🔸 {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-bold mb-4 text-gray-800">
                    <span className="text-lg">💰</span>
                    <span>Price Range</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min ₹"
                      className="w-full px-4 py-4 bg-gradient-to-r from-green-50/80 to-green-100/60 backdrop-blur-sm border-2 border-green-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-xl hover:shadow-2xl group-hover:border-green-300"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max ₹"
                      className="w-full px-4 py-4 bg-gradient-to-r from-red-50/80 to-red-100/60 backdrop-blur-sm border-2 border-red-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/30 focus:border-red-400 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-xl hover:shadow-2xl group-hover:border-red-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-3">
                <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
              </div>
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-3">All Products</h1>
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold text-sky-600">{products.length}</span> products found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                <p className="mt-4 text-gray-600">Loading amazing products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {products.map((product, index) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-sky-200 animate-fade-in-up transform hover:-translate-y-2 block cursor-pointer"
                    style={{animationDelay: `${0.1 * index}s`}}
                  >
                    <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                          <div className="text-center">
                            <div className="text-5xl mb-3 opacity-60">👟</div>
                            <span className="text-gray-400 text-sm font-medium">No Image Available</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(product._id, e)}
                        disabled={wishlistLoading[product._id]}
                        className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50 shadow-lg z-10 cursor-pointer ${
                          wishlist.includes(product._id) 
                            ? 'bg-red-500 text-white shadow-red-200' 
                            : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                      >
                        {wishlistLoading[product._id] ? (
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-5 h-5" fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    <div className="p-6">
                      {/* Brand */}
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">
                          {product.brand}
                        </span>
                      </div>
                      
                      {/* Product Name */}
                      <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-sky-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm font-medium text-gray-600 ml-2">
                            {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0})
                          </span>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-6">
                        <p className="text-3xl font-black bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                          ₹{Math.floor(product.price)}
                        </p>
                      </div>
                      
                      
                      {/* View Details Button */}
                      <div className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-4 rounded-2xl font-bold text-center hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        View Details
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;