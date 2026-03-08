import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const PhotoCategories = () => {
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorizedPhotos();
  }, []);

  const fetchCategorizedPhotos = async () => {
    try {
      const response = await api.get('/photos/categories');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'formal', name: 'Formal', color: 'bg-blue-100 text-blue-800' },
    { key: 'sneakers', name: 'Sneakers', color: 'bg-green-100 text-green-800' },
    { key: 'sports', name: 'Sports', color: 'bg-red-100 text-red-800' },
    { key: 'casual', name: 'Casual', color: 'bg-purple-100 text-purple-800' }
  ];

  if (loading) return <div className="text-center py-8">Loading photos...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Photo Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <div key={category.key} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${category.color}`}>
                {photos[category.key]?.length || 0} photos
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {photos[category.key]?.slice(0, 4).map((photo, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}/uploads/${category.key}/${photo}`}
                    alt={`${category.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {(!photos[category.key] || photos[category.key].length === 0) && (
                <div className="col-span-2 text-center text-gray-500 py-8">
                  No photos in this category
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoCategories;