const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get all orders and calculate revenue based on current status
    const allOrders = await Order.find({});
    const activeOrders = allOrders.filter(order => order.status !== 'Cancelled');
    const cancelledOrdersList = allOrders.filter(order => order.status === 'Cancelled');
    
    const totalRevenue = activeOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const cancelledRevenue = cancelledOrdersList.reduce((sum, order) => sum + order.totalPrice, 0);

    const [totalUsers, totalProducts, recentOrders, lowStockProducts, monthlySales, categoryStats, brandStats] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
      Product.find({ stock: { $lt: 10 } }).sort({ stock: 1 }).limit(10),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, totalSales: { $sum: '$totalPrice' }, orderCount: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$brand', count: { $sum: 1 } } }])
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders: activeOrders.length,
      totalRevenue,
      cancelledOrders: cancelledOrdersList.length,
      cancelledRevenue,
      recentOrders,
      lowStockProducts,
      monthlySales,
      categoryStats,
      brandStats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users with pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle user admin status
router.put('/users/:id/admin', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    res.json({ message: 'User admin status updated', isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;