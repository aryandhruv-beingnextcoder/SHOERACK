import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addCount, setAddCount] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
    }
  }, [user, id]);

  const checkWishlistStatus = async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/users/wishlist');
      const wishlist = response.data;
      setIsInWishlist(wishlist.some(item => item._id === id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
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

    setIsWishlistLoading(true);
    try {
      if (isInWishlist) {
        await api.delete(`/users/wishlist/${id}`);
        setIsInWishlist(false);
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
        await api.post(`/users/wishlist/${id}`);
        setIsInWishlist(true);
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
      setIsWishlistLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors && response.data.colors.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    fetchProduct(); // Refresh product data to show new review
  };

  const addToCart = () => {
    setIsAdding(true);
    setAddCount(quantity);
    
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => 
      item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    setTimeout(() => {
      setIsAdding(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1500);
    }, 800);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Section */}
          <div className="lg:w-3/5">
            <div className="space-y-6 animate-fade-in-up lg:sticky lg:top-8">
              <div className="relative group bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={getImageUrl(product.images[selectedImageIndex])}
                  alt={product.name}
                  className="relative w-full h-72 lg:h-96 object-cover rounded-2xl shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop';
                  }}
                />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 glassmorphism hover:bg-white/30 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 glassmorphism hover:bg-white/30 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          </div>

          {/* Product Info Section */}
          <div className="lg:w-2/5">
            <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/20">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {product.category}
                    </span>
                    <button 
                      onClick={toggleWishlist}
                      disabled={isWishlistLoading}
                      className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50 shadow-lg ${
                        isInWishlist 
                          ? 'bg-red-500 text-white shadow-red-200' 
                          : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
                      }`}
                    >
                      {isWishlistLoading ? (
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-6 h-6" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                  <p className="text-base text-sky-600 font-semibold">{product.brand}</p>
                </div>
                
                <div>
                  <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">₹{Math.floor(product.price)}</span>
                </div>
                

              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/20">
                <h3 className="text-base font-bold mb-2 text-gray-900">Select Size</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                        selectedSize === size 
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-200' 
                          : 'bg-white/90 hover:bg-sky-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/20">
                <h3 className="text-base font-bold mb-2 text-gray-900">Color: <span className="text-sky-600">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-16 h-16 rounded-2xl border-4 transition-all duration-300 hover:scale-110 shadow-lg ${
                        selectedColor === color 
                          ? 'border-sky-500 shadow-sky-200 ring-4 ring-sky-200' 
                          : 'border-gray-300 hover:border-sky-300'
                      }`}
                      style={{
                        backgroundColor: 
                          color.toLowerCase().includes('black') ? '#000' :
                          color.toLowerCase().includes('white') ? '#fff' :
                          color.toLowerCase().includes('red') ? '#ef4444' :
                          color.toLowerCase().includes('blue') ? '#3b82f6' :
                          color.toLowerCase().includes('green') ? '#10b981' :
                          color.toLowerCase().includes('yellow') ? '#f59e0b' :
                          color.toLowerCase().includes('gray') ? '#6b7280' : '#8b5cf6'
                      }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="w-full h-full rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}



            {/* Quantity & Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Quantity</h3>
                    <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-white/90 hover:bg-sky-50 p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg border border-gray-200"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-2xl font-bold text-lg min-w-[60px] text-center shadow-lg">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="bg-white/90 hover:bg-sky-50 p-3 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 shadow-lg border border-gray-200"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  disabled={product.stock === 0 || isAdding}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-3 px-6 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-sky-200"
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Adding to Cart...</span>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </span>
                  ) : addedToCart ? (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Added to Cart</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <span>Add to Cart</span>
                    </span>
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/20">
              <h3 className="text-lg font-bold mb-3 text-gray-900">Product Details</h3>
              <div className="space-y-4">
                {product.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Brand</h4>
                    <p className="text-gray-600">{product.brand}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                  {product.material && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Material</h4>
                      <p className="text-gray-600">{product.material}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Stock</h4>
                    <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Premium Quality Materials</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Comfortable Fit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Durable Construction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Easy Care & Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {addedToCart && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce font-bold text-center">
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Successfully added to cart!</span>
                </span>
              </div>
            )}
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewSection product={product} onReviewAdded={handleReviewAdded} />
        </div>
      </div>
      
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-16 bg-black/60 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <img
            src={getImageUrl(product.images[selectedImageIndex])}
            alt={product.name}
            className="max-w-full max-h-full object-contain shadow-2xl"
            onClick={() => setIsFullscreen(false)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;