import React, { useEffect, useState } from 'react';

const OrderSuccessModal = ({ isOpen, onClose, orderData, paymentMethod }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
            <p className="text-green-100">Your order has been successfully placed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Order Details */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Order ID</span>
              <span className="text-sm font-bold text-gray-800">#{orderData?.orderId || 'ORD' + Date.now()}</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Total Amount</span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ₹{orderData?.totalPrice?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Payment Method</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {paymentMethod === 'razorpay' ? '💳 Online' : '💵 COD'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <span className="mr-2">📦</span>
              Order Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Order Confirmed</span>
                <span className="text-xs text-green-600 font-medium">✓ Done</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-sm text-gray-700">Processing</span>
                <span className="text-xs text-yellow-600 font-medium">⏳ In Progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Shipped</span>
                <span className="text-xs text-gray-400">⏱️ Pending</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => window.location.href = `/order/${orderData?.orderId}`}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Track Order
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>

          {/* Thank you message */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Thank you for shopping with <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">StepStore</span>! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;