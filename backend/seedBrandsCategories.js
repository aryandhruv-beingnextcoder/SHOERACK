const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
require('dotenv').config();

const brands = [
  { name: 'Nike', description: 'Just Do It - Leading athletic footwear brand' },
  { name: 'Adidas', description: 'Impossible is Nothing - German sportswear giant' },
  { name: 'Puma', description: 'Forever Faster - Athletic and casual footwear' },
  { name: 'Reebok', description: 'Be More Human - Fitness and lifestyle brand' }
];

const categories = [
  { name: 'Sports', description: 'High-performance athletic shoes' },
  { name: 'Sneakers', description: 'Casual and lifestyle sneakers' },
  { name: 'Casual', description: 'Everyday comfortable footwear' },
  { name: 'Formal', description: 'Professional and dress shoes' }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Brand.deleteMany({});
    await Category.deleteMany({});
    
    await Brand.insertMany(brands);
    await Category.insertMany(categories);
    
    console.log('Brands and Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedData();
