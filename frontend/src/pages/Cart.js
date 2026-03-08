import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(subtotal);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
    calculateTotal(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
    calculateTotal(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('storage'));
    setTotal(0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-8">🛒 Shopping Cart</h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <p className="text-2xl font-bold text-gray-700 mb-6">Your cart is empty</p>
            <p className="text-gray-600 mb-8">Discover amazing shoes and add them to your cart!</p>
            <a href="/" className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 shadow-xl">
              <span>🛍️</span>
              <span>Start Shopping</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">🛒 Shopping Cart</h1>
          <div></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6">
          {cartItems.map((item, index) => (
            <div key={item.id || index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-4 last:mb-0 border border-white/30 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src={item.image && item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}/${item.image}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0NUw0NSA0MEw1NSA1MEw2MCA0NUw3MCA1NUg1MEg0MEgzMEwyNSA1MEwzNSA0MEw0MCA0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {item.quantity}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.brand}</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-red-50 hover:border-red-300 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-600 shadow-lg"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-green-50 hover:border-green-300 rounded-xl flex items-center justify-center text-gray-600 hover:text-green-600 shadow-lg"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">₹{item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 hover:border-red-300"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t border-white/30">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg text-gray-600 mb-2">💰 Grand Total</p>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">₹{total}</span>
                </div>
                <button 
                  onClick={clearCart}
                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-6 py-3 rounded-xl font-medium border border-red-200 hover:border-red-300"
                >
                  🗑️ Clear Cart
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/"
                className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold text-center shadow-lg"
              >
                🛍️ Continue Shopping
              </a>
              <a 
                href="/checkout"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-center shadow-xl"
              >
                🚀 Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;