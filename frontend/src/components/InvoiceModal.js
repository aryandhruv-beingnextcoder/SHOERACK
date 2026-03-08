import React from 'react';

const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SHOERACK</h1>
                <p className="text-blue-100">Premium Footwear Store</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
              <div className="text-sm space-y-1">
                <p><strong>Invoice #:</strong> {order._id.slice(-8).toUpperCase()}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString('en-GB', {hour12: false})}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">BILL TO:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{order.user?.name || 'Admin-User'}</p>
              <p className="text-gray-600">{order.user?.email || 'admin@shoerack.com'}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">SHIP TO:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">
                {order.shippingAddress?.street || order.user?.name || 'Admin-User'}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.city || 'Surat'}, {order.shippingAddress?.state || 'Gujarat'}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.zipCode || '395009'}, {order.shippingAddress?.country || 'India'}
              </p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="px-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <div className="grid grid-cols-6 gap-2 p-3 text-xs font-bold">
                <div className="col-span-2">PRODUCT</div>
                <div className="text-center">SIZE</div>
                <div className="text-center">QTY</div>
                <div className="text-center">PRICE</div>
                <div className="text-center">TOTAL</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="bg-white">
              {order.orderItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-6 gap-2 p-3 text-xs border-b border-gray-100 last:border-b-0 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="col-span-2 font-medium text-gray-900 text-xs leading-tight">{item.name}</div>
                  <div className="text-center text-gray-600">{item.size || '7'}</div>
                  <div className="text-center text-gray-600">{item.quantity}</div>
                  <div className="text-center text-gray-600">Rs. {item.price.toLocaleString('en-IN')}</div>
                  <div className="text-center font-semibold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="p-6">
          <div className="max-w-sm ml-auto space-y-2">
            <div className="flex justify-between text-gray-600 text-xs">
              <span>Subtotal:</span>
              <span>Rs. {order.itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-xs">
              <span>Shipping:</span>
              <span>Rs. {order.shippingPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-xs">
              <span>Tax:</span>
              <span>Rs. {order.taxPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl flex justify-between font-bold text-sm">
              <span>TOTAL:</span>
              <span>Rs. {order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center text-gray-600 space-y-2">
            <p className="font-semibold text-gray-800">Thank you for shopping with SHOERACK!</p>
            <p className="text-sm">📧 support@shoerack.com | 📞 +91 75730 72000</p>
            <p className="text-sm">🌐 www.shoerack.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;