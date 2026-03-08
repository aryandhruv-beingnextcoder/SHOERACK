import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotificationModal from '../components/NotificationModal';
import api from '../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL.replace('/api', '')}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFormData({ 
            name: userData.name, 
            email: userData.email,
            phone: userData.phone || '',
            address: userData.address || { street: '', city: '', state: '', zipCode: '' }
          });
        } else {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/myorders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const response = await api.get('/users/wishlist');
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews/user/my-reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchUser();
    fetchOrders();
    fetchWishlist();
    fetchReviews();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ 
      name: user.name, 
      email: user.email,
      phone: user.phone || '',
      address: user.address || { street: '', city: '', state: '', zipCode: '' }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL.replace('/api', '')}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        setIsEditing(false);
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Profile updated successfully!'
        });
      } else {
        console.error('Update failed:', data);
        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Update Failed',
          message: data.message || 'Failed to update profile'
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Network Error',
        message: 'Please check your connection and try again.'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-2xl font-bold">{user.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Account</h1>
                <p className="text-gray-600 text-lg font-medium">Welcome back, {user.name}!</p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl mb-8">
            <div className="p-2">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    activeTab === 'wishlist'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  ❤️ Wishlist ({wishlist.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  📦 Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    activeTab === 'reviews'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  ⭐ Reviews ({reviews.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">👤</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Profile Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">👨‍💼</span>
                    <label className="text-lg font-bold text-gray-700">Name</label>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                    />
                  ) : (
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user.name}</p>
                  )}
                </div>
                
                <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">📧</span>
                    <label className="text-lg font-bold text-gray-700">Email</label>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-800">{user.email}</p>
                  )}
                </div>
                
                <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">📱</span>
                    <label className="text-lg font-bold text-gray-700">Phone</label>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-800">{user.phone || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{user.isAdmin ? '⚡' : '👤'}</span>
                    <label className="text-lg font-bold text-gray-700">Account Type</label>
                  </div>
                  <span className={`px-6 py-3 rounded-2xl font-bold text-lg shadow-lg inline-block ${
                    user.isAdmin 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                  }`}>
                    {user.isAdmin ? '⚡ Admin' : '👤 Customer'}
                  </span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-2xl">🏠</span>
                    <label className="text-lg font-bold text-gray-700">Address</label>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                        placeholder="Street Address"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                          placeholder="State"
                        />
                      </div>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-gray-800 shadow-lg"
                        placeholder="Zip Code"
                      />
                    </div>
                  ) : (
                    <div>
                      {user.address && (user.address.street || user.address.city) ? (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                          <p className="text-lg font-bold text-gray-800 mb-2">📍 {user.address.street}</p>
                          <p className="text-lg font-bold text-gray-800">🏙️ {user.address.city}, {user.address.state} {user.address.zipCode}</p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                          <p className="text-gray-500 text-lg">📍 No address provided</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-12 flex flex-wrap gap-6 justify-center">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      ✅ Save Changes
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gradient-to-r from-gray-500 to-slate-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-gray-600 hover:to-slate-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEdit}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">💖</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">My Wishlist</h2>
              </div>
              {wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 opacity-60">💔</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-8">Discover amazing products and add them to your wishlist!</p>
                  <Link to="/products" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    🛍️ Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wishlist.map((product) => (
                    <div key={product._id} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-pink-200 animate-fade-in-up transform hover:-translate-y-2">
                      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].startsWith('http') ? product.images[0] : `${process.env.REACT_APP_API_URL.replace('/api', '') || 'http://localhost:5001'}/${product.images[0]}`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-6xl" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                          👟
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            {product.brand?.name || 'Brand'}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors duration-300">
                          {product.name}
                        </h3>
                        
                        <div className="mb-6">
                          <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{Math.floor(product.price)}
                          </p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Link 
                            to={`/products/${product._id}`}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-bold text-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            👁️ View
                          </Link>
                          <button 
                            onClick={async () => {
                              try {
                                await api.delete(`/users/wishlist/${product._id}`);
                                setWishlist(wishlist.filter(item => item._id !== product._id));
                                setNotification({
                                  isOpen: true,
                                  type: 'success',
                                  title: 'Removed!',
                                  message: 'Product removed from wishlist'
                                });
                              } catch (error) {
                                setNotification({
                                  isOpen: true,
                                  type: 'error',
                                  title: 'Error',
                                  message: 'Failed to remove from wishlist'
                                });
                              }
                            }}
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">📦</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">My Orders</h2>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 opacity-60">📦</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No orders yet</h3>
                  <p className="text-gray-500 mb-8">Start shopping to see your orders here!</p>
                  <Link to="/products" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    🛍️ Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <p className="text-gray-600 text-sm font-medium">
                            📅 {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mt-2">
                            ₹{order.totalPrice}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-6">
                        {order.orderItems.slice(0, 4).map((item, index) => (
                          <div key={index} className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                            {item.image ? (
                              <img 
                                src={item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL.replace('/api', '') || 'http://localhost:5001'}/${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            ) : null}
                            <span className="text-3xl" style={{display: item.image ? 'none' : 'block'}}>👟</span>
                          </div>
                        ))}
                        {order.orderItems.length > 4 && (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-blue-600 font-bold text-sm">+{order.orderItems.length - 4}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                        <div className="text-sm font-medium text-gray-700">
                          📦 {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • 
                          {order.isPaid ? '✅ Paid' : '⏳ Payment Pending'}
                        </div>
                        <Link 
                          to={`/order/${order._id}`}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          👁️ View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">My Reviews</h2>
              </div>
              {reviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 opacity-60">⭐</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No reviews yet</h3>
                  <p className="text-gray-500 mb-8">Share your experience by reviewing products you've purchased!</p>
                  <Link to="/products" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    🛍️ Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-yellow-200 p-6">
                      <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                          {review.product.images && review.product.images.length > 0 ? (
                            <img 
                              src={review.product.images[0].startsWith('http') ? review.product.images[0] : `${process.env.REACT_APP_API_URL.replace('/api', '') || 'http://localhost:5001'}/${review.product.images[0]}`}
                              alt={review.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <span className="text-4xl" style={{display: review.product.images && review.product.images.length > 0 ? 'none' : 'block'}}>👟</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <Link 
                                to={`/products/${review.product._id}`}
                                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 line-clamp-2"
                              >
                                {review.product.name}
                              </Link>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-lg ${
                                        star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">Product Rating</div>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span className="font-bold text-gray-700">{review.product.rating?.toFixed(1) || '0.0'}</span>
                                <span className="text-gray-500 text-sm">({review.product.numReviews})</span>
                              </div>
                            </div>
                          </div>
                          
                          {review.comment && (
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200">
                              <div className="text-sm font-semibold text-gray-700 mb-2">Your Review:</div>
                              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;