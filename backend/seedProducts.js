const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Nike Air Max 270',
    price: 12999,
    brand: 'Nike',
    category: 'Sneakers',
    description: 'The Nike Air Max 270 delivers visible cushioning under every step.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Red'],
    stock: 50,
    features: ['Air Max cushioning', 'Breathable mesh', 'Durable rubber outsole'],
    rating: 4.5,
    numReviews: 25
  },
  {
    name: 'Adidas Ultraboost 22',
    price: 15999,
    brand: 'Adidas',
    category: 'Sports',
    description: 'Experience endless energy with Adidas Ultraboost 22.',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Blue'],
    stock: 30,
    features: ['Boost midsole', 'Primeknit upper', 'Continental rubber outsole'],
    rating: 4.7,
    numReviews: 18
  },
  {
    name: 'Puma Classic Suede',
    price: 7999,
    brand: 'Puma',
    category: 'Casual',
    description: 'Timeless style meets modern comfort in the Puma Classic Suede.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop'
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Navy', 'Red', 'Green'],
    stock: 40,
    features: ['Suede upper', 'Rubber sole', 'Classic design'],
    rating: 4.3,
    numReviews: 32
  },
  {
    name: 'Clarks Desert Boot',
    price: 11999,
    brand: 'Clarks',
    category: 'Formal',
    description: 'The iconic Clarks Desert Boot - a timeless classic.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Brown', 'Black', 'Tan'],
    stock: 25,
    features: ['Leather upper', 'Crepe sole', 'Ankle height'],
    rating: 4.6,
    numReviews: 15
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();