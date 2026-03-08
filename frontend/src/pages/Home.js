import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestProducts, setLatestProducts] = useState([]);

  const heroSlides = [
    {
      title: "Step Into Style",
      subtitle: "Discover premium footwear that defines your journey",
      bg: "from-sky-300 via-sky-400 to-sky-500"
    },
    {
      title: "Comfort Meets Fashion",
      subtitle: "Experience the perfect blend of style and comfort",
      bg: "from-sky-400 via-sky-500 to-sky-600"
    },
    {
      title: "Walk With Confidence",
      subtitle: "Every step tells your story - make it count",
      bg: "from-sky-200 via-sky-300 to-sky-400"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    const fetchLatestProducts = async () => {
      try {
        const response = await api.get('/products?limit=3');
        setLatestProducts(response.data.products.slice(0, 3));
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    };
    
    fetchLatestProducts();
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].bg} transition-all duration-1000`}>
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 animate-fade-in-up opacity-90 leading-relaxed px-4" style={{animationDelay: '0.2s'}}>
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4" style={{animationDelay: '0.4s'}}>
              <button 
                onClick={() => navigate('/products')}
                className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform text-sm sm:text-base"
              >
                Shop Collection
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Explore Brands
              </button>
            </div>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/30 to-blue-50/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold pb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              Shop by Category
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 animate-fade-in-up px-4" style={{animationDelay: '0.2s'}}>
              Find your perfect pair from our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                name: 'Sneakers', 
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
                description: 'Street style meets comfort',
                color: 'from-blue-500 to-cyan-500',
                icon: '👟'
              },
              { 
                name: 'Formal', 
                image: 'https://tse4.mm.bing.net/th/id/OIP.J7EXIJ9YZpfqneEHQCLv-wHaEU?rs=1&pid=ImgDetMain&o=7&rm=3',
                description: 'Elegance for every occasion',
                color: 'from-gray-700 to-gray-900',
                icon: '👞'
              },
              { 
                name: 'Sports', 
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
                description: 'Performance meets innovation',
                color: 'from-orange-500 to-red-500',
                icon: '⚡'
              }
            ].map((category, index) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 animate-fade-in-up border border-white/20"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Background Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTcwTDIzMCAxNDBMMjgwIDE5MEwzMTAgMTYwTDM3MCAyMjBIMjgwSDIwMEgxMjBMNTAgMTkwTDEyMCAxNDBMMjAwIDE3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4=';
                      }}
                    />
                    {/* Category Icon Overlay */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Explore Collection</span>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✨ Latest Arrivals
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">Discover our newest collection of premium footwear</p>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {latestProducts.map((product, index) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 border border-white/20"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={(() => {
                        const imagePath = product.images[0];
                        const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
                        const finalUrl = imagePath.startsWith('http') ? imagePath : `${API_BASE}/${imagePath}`;
                        console.log('Image path:', imagePath, '-> Final URL:', finalUrl);
                        return finalUrl;
                      })()} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">👟</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{Math.floor(product.price)}
                    </p>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: '🚚',
                title: 'Free Shipping',
                description: 'Free delivery on orders over ₹5000'
              },
  
              {
                icon: '🛡️',
                title: 'Secure Payment',
                description: 'Your payment information is safe'
              },
              {
                icon: '⭐',
                title: 'Premium Quality',
                description: 'Authentic branded shoes with quality guarantee'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>




    </div>
  );
};

export default Home;