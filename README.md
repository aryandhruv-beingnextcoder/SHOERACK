# 👟 SHOERACK - Modern E-commerce Platform

SHOERACK is a responsive MERN Stack Ecommerce application featuring a dynamic product catalog, secure JWT authentication, and an Admin Dashboard for seamless inventory and Order management.

A modern, full-stack e-commerce platform for selling shoes with a beautiful UI, built with React, Node.js, and MongoDB.

## ✨ Features

- 🎨 **Modern UI Design** with glassmorphism effects and smooth animations
- 📱 **Responsive Design** - works perfectly on all devices
- 🛒 **Shopping Cart** with local storage persistence
- 👤 **User Authentication** with JWT tokens
- 🔍 **Advanced Product Filtering** by category, brand, price
- 💳 **Secure Checkout Process** with Razorpay integration
- 👨💼 **Admin Panel** for managing products, orders, and users
- 🎯 **Real-time Updates** and smooth user experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryandhruv-beingnextcoder/SHOERACK.git
   cd SHOERACK
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   Backend (.env in /backend folder):
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/shoerack
   JWT_SECRET=your_jwt_secret_key_here
   ```
   
   Frontend (.env in /frontend folder):
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Admin Panel**: http://localhost:3000/admin

## 📁 Project Structure

```
SHOERACK/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── utils/          # Utility functions
│   └── public/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
└── README.md
```

## 🛠️ API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run seed` - Seed database with sample data

---

**Happy coding! 🎉**