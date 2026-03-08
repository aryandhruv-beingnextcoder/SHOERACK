import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderSuccessModal from '../components/OrderSuccessModal';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import NotificationModal from '../components/NotificationModal';
import api from '../utils/api';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  
  const [orderSummary, setOrderSummary] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, type: 'error', title: '', message: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate('/cart');
      return;
    }
    
    setCartItems(savedCart);
    calculateOrderSummary(savedCart);
    checkUserProfile();
  }, [user, navigate]);

  const checkUserProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      setUserProfile(userData);
      
      const missing = [];
      if (!userData.phone) missing.push('Phone Number');
      if (!userData.address?.street) missing.push('Street Address');
      if (!userData.address?.city) missing.push('City');
      if (!userData.address?.state) missing.push('State');
      if (!userData.address?.zipCode) missing.push('ZIP Code');
      
      if (missing.length > 0) {
        setMissingFields(missing);
        // Auto-fill shipping address if available
        if (userData.address) {
          setShippingAddress({
            street: userData.address.street || '',
            city: userData.address.city || '',
            state: userData.address.state || '',
            zipCode: userData.address.zipCode || '',
            country: 'India'
          });
        }
      } else {
        // Auto-fill complete address
        setShippingAddress({
          street: userData.address.street,
          city: userData.address.city,
          state: userData.address.state,
          zipCode: userData.address.zipCode,
          country: 'India'
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const calculateOrderSummary = (items) => {
    const itemsPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice < 5000 ? Math.round(itemsPrice * 0.1) : 0;
    const taxPrice = Math.round(itemsPrice * 0.05);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    setOrderSummary({
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { street, city, state, zipCode } = shippingAddress;
    return street && city && state && zipCode;
  };

  const handlePlaceOrder = async () => {
    // Check if profile is complete first
    if (missingFields.length > 0) {
      setShowProfileModal(true);
      return;
    }
    
    if (!validateForm()) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Incomplete Form',
        message: 'Please fill in all shipping address fields'
      });
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id || item.id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: Number(item.quantity),
          size: item.size || 'M',
          color: item.color || 'Default'
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        paymentMethod,
        itemsPrice: Number(orderSummary.itemsPrice),
        taxPrice: Number(orderSummary.taxPrice),
        shippingPrice: Number(orderSummary.shippingPrice),
        totalPrice: Number(orderSummary.totalPrice)
      };
      
      console.log('Order data being sent:', orderData);
      console.log('User:', user);
      console.log('Cart items:', cartItems);

      if (paymentMethod === 'razorpay') {
        // For now, simulate online payment by creating order as paid
        const order = await api.post('/orders', orderData);
        
        // Mark as paid immediately (simulation)
        await api.put(`/orders/${order.data._id}/pay`, {
          id: `sim_${Date.now()}`,
          status: 'completed',
          update_time: new Date().toISOString(),
          email_address: user?.email || ''
        });

        // Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        
        // Show success modal
        setOrderData({ orderId: order.data._id, totalPrice: orderSummary.totalPrice });
        setShowSuccessModal(true);
      } else {
        // Cash on Delivery
        const order = await api.post('/orders', orderData);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        
        // Show success modal
        setOrderData({ orderId: order.data._id, totalPrice: orderSummary.totalPrice });
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred.';
      }
      
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Checkout Failed',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
  };

  return (
    <>
      <OrderSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        orderData={orderData}
        paymentMethod={paymentMethod}
      />
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={handleProfileModalClose}
        missingFields={missingFields}
      />
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose={false}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">Secure Checkout</h1>
            <p className="text-gray-600">Complete your order in just a few steps</p>
          </div>
          <div></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
                </div>
                {userProfile?.address && (
                  <span className="text-xs bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full font-medium shadow-lg">
                    ✓ Auto-filled from profile
                  </span>
                )}
              </div>
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="w-full p-4 bg-gray-100/50 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-600 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <label className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'razorpay' 
                    ? 'border-purple-500 bg-purple-50/50 shadow-lg' 
                    : 'border-gray-200 bg-white/30 hover:border-purple-300 hover:bg-purple-50/30'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Online Payment (Razorpay)</span>
                      <p className="text-sm text-gray-600">Pay securely with cards, UPI, or net banking</p>
                    </div>
                  </div>
                </label>
                <label className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'cod' 
                    ? 'border-green-500 bg-green-50/50 shadow-lg' 
                    : 'border-gray-200 bg-white/30 hover:border-green-300 hover:bg-green-50/30'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Cash on Delivery</span>
                      <p className="text-sm text-gray-600">Pay when your order arrives</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 sticky top-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={item.image && item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl shadow-md"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyN0wyNyAyNEwzMyAzMEwzNiAyN0w0MiAzM0gzMEgyNEgxOEwxNSAzMEwyMSAyNEwyNCAyN1oiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">₹{item.price * item.quantity}</p>
                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Items Price:</span>
                  <span className="font-semibold text-gray-800">₹{orderSummary.itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Shipping:</span>
                  <span className={`font-semibold ${orderSummary.shippingPrice === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {orderSummary.shippingPrice === 0 ? 'FREE' : `₹${orderSummary.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Tax (5%):</span>
                  <span className="font-semibold text-gray-800">₹{orderSummary.taxPrice}</span>
                </div>
                <div className="border-t border-gray-200/50 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">₹{orderSummary.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Status */}
            {missingFields.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-100/80 to-yellow-100/80 backdrop-blur-sm border border-orange-200/50 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-800">Profile Incomplete</p>
                    <p className="text-sm text-orange-700">Complete your profile to proceed with checkout</p>
                  </div>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                missingFields.length > 0
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : missingFields.length > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Complete Profile First</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Place Order</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;