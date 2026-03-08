import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import InvoiceModal from '../components/InvoiceModal';



const OrderDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      navigate('/profile');
    } finally {
      setLoading(false);
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





  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/profile')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl text-blue-600 hover:bg-white/50 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-lg mb-6"
          >
            <span>←</span>
            <span className="font-medium">Back to Orders</span>
          </button>
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-xl font-bold">📦</span>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Details</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order #{order._id.slice(-8)}</h2>
                  <p className="text-gray-600 font-medium flex items-center space-x-2 mt-2">
                    <span>📅</span>
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
                  </p>
                </div>
                <span className={`px-6 py-3 rounded-2xl text-lg font-bold shadow-lg ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              {order.isPaid && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-4 mb-4 shadow-lg">
                  <p className="text-green-800 font-bold flex items-center space-x-2">
                    <span>✅</span>
                    <span>Payment Confirmed</span>
                  </p>
                  <p className="text-green-600 font-medium ml-6">Paid on {new Date(order.paidAt).toLocaleDateString()} at {new Date(order.paidAt).toLocaleTimeString()}</p>
                </div>
              )}
              
              {order.isDelivered && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-4 shadow-lg">
                  <p className="text-blue-800 font-bold flex items-center space-x-2">
                    <span>🚚</span>
                    <span>Delivered</span>
                  </p>
                  <p className="text-blue-600 font-medium ml-6">Delivered on {new Date(order.deliveredAt).toLocaleDateString()} at {new Date(order.deliveredAt).toLocaleTimeString()}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center space-x-2">
                <span>🛍️</span>
                <span>Order Items</span>
              </h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-6 bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl p-4 mb-4 last:mb-0 hover:bg-white/40 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image && item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}/${item.image}`}
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
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-medium">📏 {item.size}</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg font-medium">🎨 {item.color}</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg font-medium">📦 {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{item.price}</p>
                      <p className="text-sm text-gray-600 font-medium">Total: ₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center space-x-2">
                <span>📍</span>
                <span>Shipping Address</span>
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 text-gray-800 font-medium space-y-2">
                <p className="flex items-center space-x-2"><span>🏠</span><span>{order.shippingAddress.street}</span></p>
                <p className="flex items-center space-x-2"><span>🏙️</span><span>{order.shippingAddress.city}, {order.shippingAddress.state}</span></p>
                <p className="flex items-center space-x-2"><span>📮</span><span>{order.shippingAddress.zipCode}</span></p>
                <p className="flex items-center space-x-2"><span>🌍</span><span>{order.shippingAddress.country}</span></p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 h-fit">
            <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center space-x-2">
              <span>💰</span>
              <span>Order Summary</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl">
                <span className="font-medium text-gray-700">Items Price:</span>
                <span className="font-bold text-gray-800">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl">
                <span className="font-medium text-gray-700">Shipping:</span>
                <span className="font-bold text-gray-800">₹{order.shippingPrice}</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-xl">
                <span className="font-medium text-gray-700">Tax:</span>
                <span className="font-bold text-gray-800">₹{order.taxPrice}</span>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl flex justify-between items-center text-white shadow-lg">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-black">₹{order.totalPrice}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-white/30">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
                <p className="font-bold text-gray-800 flex items-center space-x-2 mb-2">
                  <span>💳</span>
                  <span>Payment Method: {order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</span>
                </p>
                {order.paymentResult?.id && (
                  <p className="text-sm text-gray-600 font-medium ml-6">
                    Payment ID: {order.paymentResult.id}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>📋</span>
                <span>View Invoice</span>
              </button>
            </div>

          </div>
        </div>
        
        <InvoiceModal 
          order={order}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      </div>
    </div>
  );
};

export default OrderDetails;