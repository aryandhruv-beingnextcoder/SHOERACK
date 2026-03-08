import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNav from '../components/AdminNav';
import { BarChart, DoughnutChart } from '../components/Chart';
import InvoiceModal from '../components/InvoiceModal';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchStats();
    }
    setLoading(false);
  }, [user]);

  const fetchStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const response = await api.get('/admin/stats?t=' + Date.now());
      console.log('Full API response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        cancelledOrders: 0,
        cancelledRevenue: 0,
        recentOrders: [],
        lowStockProducts: [],
        monthlySales: [],
        categoryStats: [],
        brandStats: []
      });
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  if (!user?.isAdmin) {
    return <div className="p-8 text-center">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => navigate('/admin/products')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Products</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-4xl font-black text-white mb-1">{stats.totalProducts || 0}</p>
            <p className="text-xs text-slate-400">Active inventory items</p>
          </div>
          <div 
            onClick={() => navigate('/admin/orders')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Orders</h3>
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-4xl font-black text-white mb-1">{stats.totalOrders || 0}</p>
            <p className="text-xs text-slate-400">Non-cancelled orders</p>
          </div>
          <div 
            onClick={() => navigate('/admin/users')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Users</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-4xl font-black text-white mb-1">{stats.totalUsers || 0}</p>
            <p className="text-xs text-slate-400">Registered customers</p>
          </div>
          <div 
            onClick={() => navigate('/admin/orders')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Net Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-4xl font-black text-white mb-1">₹{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-slate-400">Excluding cancelled orders</p>
          </div>
        </div>

        {((stats.cancelledOrders || 0) > 0 || (stats.cancelledRevenue || 0) > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-6 rounded-2xl shadow-2xl border border-red-700 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wider">Cancelled Orders</h3>
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{stats.cancelledOrders || 0}</p>
              <p className="text-xs text-red-400">Orders cancelled</p>
            </div>
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-6 rounded-2xl shadow-2xl border border-red-700 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wider">Lost Revenue</h3>
                <span className="text-2xl">💸</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">₹{(stats.cancelledRevenue || 0).toFixed(2)}</p>
              <p className="text-xs text-red-400">From cancelled orders</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📋</span>
              <h3 className="text-xl font-bold text-white">Recent Orders</h3>
            </div>
            <div className="space-y-3">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order) => (
                  <div 
                    key={order._id} 
                    className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 p-2 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">#{order._id.slice(-8)}</p>
                      <p className="text-xs text-slate-400">{order.user?.name || 'Unknown User'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">₹{(order.totalPrice || 0).toFixed(2)}</p>
                        <p className="text-xs text-slate-400">{order.status}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowInvoiceModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="View Invoice"
                      >
                        👁️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-slate-400">No recent orders</p>
                  <p className="text-xs text-slate-500 mt-1">Orders will appear here once customers start placing them</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">⚠️</span>
              <h3 className="text-xl font-bold text-white">Low Stock Products</h3>
            </div>
            <div className="space-y-3">
              {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.slice(0, 5).map((product) => (
                  <div 
                    key={product._id}
                    onClick={() => navigate('/admin/products?sort=stock-low')}
                    className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 hover:bg-slate-700/30 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-400">{product.stock} left</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">{stats.totalProducts > 0 ? '✅' : '📦'}</div>
                  <p className="text-slate-400">{stats.totalProducts > 0 ? 'All products well stocked' : 'No products available'}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats.totalProducts > 0 ? 'Products with low stock will appear here' : 'Add products to monitor stock levels'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📊</span>
              <h3 className="text-xl font-bold text-white">Monthly Sales</h3>
            </div>
            <div className="h-64">
              {stats.monthlySales && stats.monthlySales.length > 0 ? (
                <BarChart 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                      label: 'Revenue (₹)',
                      data: (() => {
                        const monthlyData = new Array(12).fill(0);
                        stats.monthlySales.forEach(item => {
                          if (item._id?.month >= 1 && item._id?.month <= 12) {
                            monthlyData[item._id.month - 1] = item.totalSales || 0;
                          }
                        });
                        return monthlyData;
                      })(),
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                      borderColor: 'rgb(59, 130, 246)',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-4xl mb-2">📊</div>
                  <p>No sales data available</p>
                  <p className="text-sm">Sales data will appear once orders are placed</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🏷️</span>
              <h3 className="text-xl font-bold text-white">Products by Category</h3>
            </div>
            <div className="h-64">
              {stats.categoryStats && stats.categoryStats.length > 0 ? (
                <DoughnutChart 
                  data={{
                    labels: stats.categoryStats.map(item => item._id),
                    datasets: [{
                      data: stats.categoryStats.map(item => item.count),
                      backgroundColor: [
                        '#3B82F6',
                        '#10B981', 
                        '#F59E0B',
                        '#EF4444'
                      ],
                      borderWidth: 2,
                      borderColor: '#1E293B'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#E2E8F0',
                          padding: 20
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-4xl mb-2">🏷️</div>
                  <p>No category data available</p>
                  <p className="text-sm">Add products with categories to see chart</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🏢</span>
              <h3 className="text-xl font-bold text-white">Products by Brand</h3>
            </div>
            <div className="h-64">
              {stats.brandStats && stats.brandStats.length > 0 ? (
                <DoughnutChart 
                  data={{
                    labels: stats.brandStats.map(item => item._id),
                    datasets: [{
                      data: stats.brandStats.map(item => item.count),
                      backgroundColor: [
                        '#9333EA',
                        '#F59E0B', 
                        '#6B7280',
                        '#3B82F6',
                        '#EF4444'
                      ],
                      borderWidth: 2,
                      borderColor: '#1E293B'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#E2E8F0',
                          padding: 20
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-4xl mb-2">📊</div>
                  <p>No brand data available</p>
                  <p className="text-sm">Add products with brands to see chart</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <InvoiceModal 
          order={selectedOrder}
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;