import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import api from '../utils/api';

const AdminProducts = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    category: '',
    sizes: [],
    stock: '',
    images: [],
    features: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts();
      fetchBrands();
      fetchCategories();
      
      // Check for sort parameter in URL
      const params = new URLSearchParams(location.search);
      const sortParam = params.get('sort');
      if (sortParam) {
        setSortOrder(sortParam);
      }
    }
  }, [user, location.search]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showForm]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const sortProducts = (products, sortType) => {
    return [...products].sort((a, b) => {
      switch (sortType) {
        case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest': return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'name': return a.name.localeCompare(b.name);
        case 'price-high': return b.price - a.price;
        case 'price-low': return a.price - b.price;
        case 'stock-high': return b.stock - a.stock;
        case 'stock-low': return a.stock - b.stock;
        default: return 0;
      }
    });
  };

  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory) {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    if (filterBrand) {
      filtered = filtered.filter(product => product.brand === filterBrand);
    }
    
    filtered = sortProducts(filtered, sortOrder);
    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory, filterBrand, sortOrder]);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    if (files.length > 0) {
      // Revoke previous blob URLs to prevent memory leaks
      formData.images.forEach(img => {
        if (img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
      
      // Create preview URLs for immediate display - these will take priority
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setFormData({ ...formData, images: imageUrls });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload images first if there are files
      let finalImages = formData.images;
      
      if (imageFiles.length > 0) {
        const formDataUpload = new FormData();
        imageFiles.forEach(file => {
          formDataUpload.append('images', file);
        });
        
        const uploadResponse = await api.post('/photos/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Use uploaded images as the final images (replaces any existing ones)
        finalImages = uploadResponse.data.files;
      } else {
        // If no new files uploaded, filter out blob URLs and keep only valid image paths
        finalImages = formData.images.filter(img => !img.startsWith('blob:'));
      }
      
      const sizesArray = Array.isArray(formData.sizes) ? formData.sizes : formData.sizes.split(',').map(s => s.trim()).filter(s => s);
      const featuresArray = Array.isArray(formData.features) ? formData.features : formData.features.split(',').map(f => f.trim()).filter(f => f);
      
      const productData = {
        ...formData,
        description: formData.name + ' - Premium quality shoes',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sizes: sizesArray.length > 0 ? sizesArray : ['7', '8', '9', '10'],
        features: featuresArray,
        images: finalImages
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/products', productData);
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
      // Show custom success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-300 rounded-3xl p-8 shadow-2xl max-w-md mx-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-2">Success!</h3>
              <p class="text-emerald-700 mb-6 text-lg">Product saved successfully!</p>
              <button onclick="this.closest('.fixed').remove()" class="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                ✨ Awesome!
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 5000);
    } catch (error) {
      console.error('Error saving product:', error);
      // Show custom error notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="bg-gradient-to-br from-red-50 to-pink-100 border-2 border-red-300 rounded-3xl p-8 shadow-2xl max-w-md mx-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-red-800 mb-2">Error!</h3>
              <p class="text-red-700 mb-6 text-lg">Error saving product: ${error.response?.data?.message || error.message}</p>
              <button onclick="this.closest('.fixed').remove()" class="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 8000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      brand: '',
      category: '',
      sizes: [],
      stock: '',
      images: [],
      features: []
    });
    setImageFiles([]);
    // Clear file input and revoke blob URLs to prevent memory leaks
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    
    // Revoke any blob URLs to prevent memory leaks
    formData.images.forEach(img => {
      if (img.startsWith('blob:')) {
        URL.revokeObjectURL(img);
      }
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      brand: product.brand,
      category: product.category,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes,
      stock: product.stock.toString(),
      images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
      features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || '')
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (!user?.isAdmin) {
    return <div className="p-8 text-center">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-800 mb-2">Product Management</h1>
            <p className="text-slate-600 font-medium">Manage your inventory and product catalog</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-2xl hover:from-slate-700 hover:to-slate-800 hover:scale-105 transition-all duration-300 shadow-2xl font-bold text-lg"
          >
            ✨ Add New Product
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white border-2 border-blue-300 text-gray-800 placeholder-gray-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg font-medium"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-6 py-4 bg-gradient-to-r from-white to-gray-50 border-2 border-blue-300 text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg font-medium hover:shadow-xl cursor-pointer"
          >
            <option value="">📁 All Categories</option>
            <option value="Sneakers">👟 Sneakers</option>
            <option value="Casual">👕 Casual</option>
            <option value="Formal">👞 Formal</option>
            <option value="Sports">⚽ Sports</option>
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="w-full px-6 py-4 bg-gradient-to-r from-white to-gray-50 border-2 border-blue-300 text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg font-medium hover:shadow-xl cursor-pointer"
          >
            <option value="">🏷️ All Brands</option>
            {brands.map((brand) => (
              <option key={brand._id || brand.name} value={brand.name}>
                🔸 {brand.name}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-6 py-4 bg-gradient-to-r from-white to-gray-50 border-2 border-blue-300 text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg font-medium hover:shadow-xl cursor-pointer"
          >
            <option value="newest">📅 Newest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="name">🔤 Name A-Z</option>
            <option value="price-high">💰 Price High-Low</option>
            <option value="price-low">💰 Price Low-High</option>
            <option value="stock-high">📦 Stock High-Low</option>
            <option value="stock-low">📦 Stock Low-High</option>
          </select>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl border border-slate-700">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">✨</span>
                <h2 className="text-2xl font-black text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="mt-1 block w-full bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-400 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                      required
                    >
                      <option value="">🏷️ Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id || brand.name} value={brand.name}>
                          🔸 {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-400 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                      required
                    >
                      <option value="">📁 Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id || category.name} value={category.name}>
                          {category.name === 'Sneakers' ? '👟' : 
                           category.name === 'Casual' ? '👕' : 
                           category.name === 'Formal' ? '👞' : 
                           category.name === 'Sports' ? '⚽' : '📂'} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="7, 8, 9, 10, 11"
                      className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                      required
                    />
                  </div>
                </div>


                

                
                <div>
                  <label className="block text-sm font-medium text-white">Features (comma separated)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Waterproof, Breathable, Anti-slip"
                    className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                  />
                  <p className="text-xs text-slate-300 mt-1">Select multiple images for the product. Newly uploaded images will have a green border.</p>
                  {Array.isArray(formData.images) && formData.images.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-slate-300">Product Images ({formData.images.length})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const shuffled = [...formData.images];
                            for (let i = shuffled.length - 1; i > 0; i--) {
                              const j = Math.floor(Math.random() * (i + 1));
                              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                            }
                            setFormData({ ...formData, images: shuffled });
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs font-medium"
                          title="Shuffle image order"
                        >
                          🔀 Shuffle
                        </button>
                      </div>
                      <div className="grid grid-cols-5 gap-4">
                      {formData.images.map((img, index) => {
                        const imgSrc = img.startsWith('blob:') ? img : (img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}/${img}`);
                        const isNewUpload = img.startsWith('blob:');
                        return (
                          <div key={index} className="relative">
                            <img 
                              src={imgSrc} 
                              alt={`Preview ${index + 1}`} 
                              className={`h-20 w-20 object-cover rounded border-2 ${isNewUpload ? 'border-green-500' : 'border-blue-300'}`}
                              title={isNewUpload ? 'Newly uploaded image' : 'Existing image'}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = formData.images.filter((_, i) => i !== index);
                                const newFiles = imageFiles.filter((_, i) => i !== index);
                                setFormData({ ...formData, images: newImages });
                                setImageFiles(newFiles);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-md transition-all duration-200 hover:scale-110"
                              title="Remove image"
                            >
                              X
                            </button>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white">Or Image URLs (comma separated)</label>
                  <textarea
                    value={Array.isArray(formData.images) ? formData.images.filter(img => !img.startsWith('blob:')).join(', ') : formData.images}
                    onChange={(e) => {
                      const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                      setFormData({ ...formData, images: urls });
                    }}
                    placeholder="uploads/sneakers/image1.jpg, uploads/sneakers/image2.jpg"
                    className="mt-1 block w-full bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/90 transition-all duration-300"
                    rows="2"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-8 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white hover:bg-slate-600 hover:scale-105 transition-all duration-300 shadow-lg font-bold"
                    disabled={loading}
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 hover:scale-105 transition-all duration-300 shadow-lg disabled:bg-gray-400 font-bold"
                    disabled={loading}
                  >
                    {loading ? '⏳ Saving...' : `✨ ${editingProduct ? 'Update' : 'Create'} Product`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-gradient-to-r from-slate-700 to-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 bg-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].startsWith('http') ? product.images[0] : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}/${product.images[0]}`}
                          alt={product.name} 
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) => {
                            console.log('Image failed to load:', product.images[0]);
                            e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=48&h=48&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all duration-300 mr-2 font-medium"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;