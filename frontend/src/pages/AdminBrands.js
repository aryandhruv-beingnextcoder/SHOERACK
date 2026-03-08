import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';
import { DoughnutChart } from '../components/Chart';
import api from '../utils/api';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [brandStats, setBrandStats] = useState([]);

  useEffect(() => {
    fetchBrands();
    fetchBrandStats();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/brands');
      setBrands(data);
    } catch (error) {
      alert('Error fetching brands');
    }
  };

  const fetchBrandStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setBrandStats(response.data.brandStats || []);
    } catch (error) {
      console.error('Error fetching brand stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, formData);
      } else {
        await api.post('/brands', formData);
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchBrands();
      fetchBrandStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving brand');
    }
  };

  const handleEdit = (brand) => {
    setFormData({ name: brand.name, description: brand.description });
    setEditingId(brand._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this brand?')) {
      try {
        await api.delete(`/brands/${id}`);
        fetchBrands();
      } catch (error) {
        alert('Error deleting brand');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2">Manage Brands</h1>
          <p className="text-slate-600 font-medium">Create and manage shoe brands</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700">
            <div className="mb-4">
              <label className="block text-slate-300 mb-2 font-bold">Brand Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:bg-white/90 transition-all duration-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 mb-2 font-bold">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:bg-white/90 transition-all duration-300"
                rows="3"
              />
            </div>
            <button type="submit" className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 hover:scale-105 transition-all duration-300 shadow-lg">
              ✨ {editingId ? 'Update' : 'Add'} Brand
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }); }}
                className="ml-3 bg-white/70 backdrop-blur-sm border border-white/30 text-gray-700 px-6 py-3 rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Cancel
              </button>
            )}
          </form>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🏷️</span>
              <h3 className="text-xl font-bold text-white">Products by Brand</h3>
            </div>
            <div className="h-64">
              {brandStats && brandStats.length > 0 ? (
                <DoughnutChart 
                  data={{
                    labels: brandStats.map(item => item._id || 'Unknown'),
                    datasets: [{
                      data: brandStats.map(item => item.count),
                      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F97316']
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No brand data available</p>
                    <p className="text-sm">Add products with brands to see chart</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-slate-700 to-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-white font-bold">{brand.name}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{brand.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBrands;
