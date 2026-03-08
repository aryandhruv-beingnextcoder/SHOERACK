require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Brand = require('./models/Brand');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('\n========== USERS ==========');
    const users = await User.find({});
    console.log(JSON.stringify(users, null, 2));

    console.log('\n========== BRANDS ==========');
    const brands = await Brand.find({});
    console.log(JSON.stringify(brands, null, 2));

    console.log('\n========== CATEGORIES ==========');
    const categories = await Category.find({});
    console.log(JSON.stringify(categories, null, 2));

    console.log('\n========== PRODUCTS ==========');
    const products = await Product.find({});
    console.log(JSON.stringify(products, null, 2));

    console.log('\n========== ORDERS ==========');
    const orders = await Order.find({});
    console.log(JSON.stringify(orders, null, 2));

    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
