import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCards = () => {
  const categories = [
    {
      name: 'Sneakers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      description: 'Explore our premium sneakers collection'
    },
    {
      name: 'Formal',
      image: 'https://tse4.mm.bing.net/th/id/OIP.J7EXIJ9YZpfqneEHQCLv-wHaEU?rs=1&pid=ImgDetMain&o=7&rm=3',
      description: 'Explore our premium formal collection'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      description: 'Explore our premium sports collection'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="h-64 bg-gray-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.name} Collection</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;