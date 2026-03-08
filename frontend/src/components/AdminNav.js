import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', gradient: 'from-blue-500 to-purple-600' },
    { path: '/admin/products', label: 'Products', icon: '👟', gradient: 'from-green-500 to-teal-600' },
    { path: '/admin/brands', label: 'Brands', icon: '🏷️', gradient: 'from-orange-500 to-red-600' },
    { path: '/admin/categories', label: 'Categories', icon: '📁', gradient: 'from-yellow-500 to-orange-600' },
    { path: '/admin/users', label: 'Users', icon: '👥', gradient: 'from-pink-500 to-rose-600' },
    { path: '/admin/orders', label: 'Orders', icon: '📦', gradient: 'from-indigo-500 to-blue-600' }
  ];

  return (
    <div className="relative">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Admin Panel Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SHOERACK Admin</h1>
                <p className="text-purple-200 text-sm">Management Dashboard</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Back to Store</span>
            </Link>
          </div>
          
          {/* Navigation Items */}
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'transform scale-105 shadow-2xl'
                    : 'hover:transform hover:scale-105 hover:shadow-xl'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-80`}></div>
                
                {/* Glassmorphism overlay */}
                <div className={`absolute inset-0 ${
                  location.pathname === item.path
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-white/10 backdrop-blur-sm group-hover:bg-white/20'
                } transition-all duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center space-x-3 px-6 py-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <span className="text-white font-semibold text-sm block">{item.label}</span>
                    <span className="text-white/70 text-xs">
                      {item.path === '/admin' ? 'Overview & Stats' :
                       item.path === '/admin/products' ? 'Manage Inventory' :
                       item.path === '/admin/brands' ? 'Brand Management' :
                       item.path === '/admin/categories' ? 'Category Setup' :
                       item.path === '/admin/users' ? 'User Management' :
                       'Order Processing'}
                    </span>
                  </div>
                </div>
                
                {/* Active indicator */}
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNav;