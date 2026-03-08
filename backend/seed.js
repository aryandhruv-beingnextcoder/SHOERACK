const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with air cushioning",
    price: 8999,
    brand: "Nike",
    category: "Sports",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "White", "Blue"],
    images: [
      "/uploads/sports/1762604990893-Screenshot 2025-11-08 175841.png",
      "/uploads/sports/1762604990902-Screenshot 2025-11-08 175831.png",
      "/uploads/sports/1762604990910-Screenshot 2025-11-08 175823.png",
      "/uploads/sports/1762604990933-Screenshot 2025-11-08 175815.png"
    ],
    stock: 50
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with boost technology",
    price: 12999,
    brand: "Adidas",
    category: "Sports",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "White", "Grey"],
    images: [
      "/uploads/sports/1762929314118-Screenshot 2025-11-12 120345.png",
      "/uploads/sports/1762929314131-Screenshot 2025-11-12 120330.png",
      "/uploads/sports/1762929314146-Screenshot 2025-11-12 120308.png",
      "/uploads/sports/1762929314152-Screenshot 2025-11-12 120254.png"
    ],
    stock: 30
  },
  {
    name: "Puma RS-X",
    description: "Retro-inspired lifestyle sneakers",
    price: 6999,
    brand: "Puma",
    category: "Sneakers",
    sizes: ["7", "8", "9", "10"],
    colors: ["White", "Black", "Red"],
    images: [
      "/uploads/sneakers/1762603962706-Screenshot 2025-11-08 174034.png",
      "/uploads/sneakers/1762603962716-Screenshot 2025-11-08 174021.png",
      "/uploads/sneakers/1762603962729-Screenshot 2025-11-08 174000.png",
      "/uploads/sneakers/1762603962732-Screenshot 2025-11-08 173948.png"
    ],
    stock: 25
  },
  {
    name: "Reebok Classic Leather",
    description: "Classic white leather sneakers",
    price: 4999,
    brand: "Reebok",
    category: "Casual",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["White", "Black"],
    images: [
      "/uploads/casual/1762768676067-Screenshot 2025-11-10 152018.png",
      "/uploads/casual/1762768676076-Screenshot 2025-11-10 152005.png",
      "/uploads/casual/1762768676078-Screenshot 2025-11-10 151950.png",
      "/uploads/casual/1762768676087-Screenshot 2025-11-10 151937.png"
    ],
    stock: 40
  },
  {
    name: "Nike Formal Oxford",
    description: "Professional leather dress shoes",
    price: 15999,
    brand: "Nike",
    category: "Formal",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "Brown"],
    images: [
      "/uploads/formal/1762753140356-8346891_1.webp",
      "/uploads/formal/1762753140356-8346891_7.webp",
      "/uploads/formal/1762753140357-8346891_2.jpeg",
      "/uploads/formal/1762840857521-Screenshot 2025-11-11 112113.png"
    ],
    stock: 20
  },
  {
    name: "Adidas Stan Smith",
    description: "Iconic white tennis shoes",
    price: 7999,
    brand: "Adidas",
    category: "Sneakers",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["White", "Green"],
    images: [
      "/uploads/sneakers/1762604368050-Screenshot 2025-11-08 174804.png",
      "/uploads/sneakers/1762604368056-Screenshot 2025-11-08 174754.png",
      "/uploads/sneakers/1762604368060-Screenshot 2025-11-08 174747.png",
      "/uploads/sneakers/1762604368063-Screenshot 2025-11-08 174739.png"
    ],
    stock: 60
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products with proper image paths
    const productsWithFullPaths = sampleProducts.map(product => ({
      ...product,
      images: product.images.map(img => `http://192.168.1.116:5001${img}`)
    }));
    await Product.insertMany(productsWithFullPaths);
    console.log('Sample products added');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@shoerack.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@shoerack.com',
        password: 'admin123',
        isAdmin: true
      });
      await admin.save();
      console.log('Admin user created: admin@shoerack.com / admin123');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();