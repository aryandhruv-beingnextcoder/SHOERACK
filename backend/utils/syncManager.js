const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

class SyncManager {
  constructor(io) {
    this.io = io;
  }

  // Emit real-time updates for products
  async syncProducts(action, data) {
    try {
      const products = await Product.find().populate('brand category');
      this.io.emit('products_updated', {
        action,
        data,
        total: products.length,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Product sync error:', error);
    }
  }

  // Emit real-time updates for orders
  async syncOrders(action, data) {
    try {
      const orders = await Order.find().populate('user', 'name email');
      this.io.emit('orders_updated', {
        action,
        data,
        total: orders.length,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Order sync error:', error);
    }
  }

  // Emit real-time updates for users
  async syncUsers(action, data) {
    try {
      const users = await User.find().select('-password');
      this.io.emit('users_updated', {
        action,
        data,
        total: users.length,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('User sync error:', error);
    }
  }

  // Full database sync
  async fullSync() {
    try {
      const [products, orders, users] = await Promise.all([
        Product.find().populate('brand category'),
        Order.find().populate('user', 'name email'),
        User.find().select('-password')
      ]);

      this.io.emit('full_sync', {
        products: products.length,
        orders: orders.length,
        users: users.length,
        timestamp: new Date()
      });

      return { success: true, counts: { products: products.length, orders: orders.length, users: users.length } };
    } catch (error) {
      console.error('Full sync error:', error);
      this.io.emit('sync_error', { error: error.message, timestamp: new Date() });
      return { success: false, error: error.message };
    }
  }
}

module.exports = SyncManager;